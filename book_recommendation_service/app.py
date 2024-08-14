from sklearn.preprocessing import StandardScaler
import joblib
import torch
import torch.nn as nn
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS
import pymongo
from bson import ObjectId
import pandas as pd
import numpy as np
import certifi
import argparse
import json
import os


parser = argparse.ArgumentParser(description='AI service parameters')
parser.add_argument('--host', dest='host', type=str, default='localhost',
                    help='Service host')
parser.add_argument('--port', dest='port', type=int, default=8004,
                    help='Service port')
parser.add_argument('--mongodb', dest='mongodb', type=str, default='',
                    help='MongoDB Connection')
args = parser.parse_args()


# model ai
# trích xuất 32 thuộc tính từ input 
class ANN(nn.Module):
    def __init__(self,input_size, emb_size):
        super(ANN, self).__init__()
        self.fc1 = nn.Linear(input_size, emb_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(emb_size, 1)

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.fc2(x)
        # x = self.relu(x)
        return x

#tính khoảng cách giữa 2 vector
def cosine_similarity(x, y):
    norm_x = np.linalg.norm(x)
    norm_y = np.linalg.norm(y,axis=1)
    
    cosim = x@y.T/(norm_x*norm_y)
    return cosim[0]


#có 1 vector so sánh khoảng cách giữa 1 vector sách với 1 tập hợp sách, chọn k quyển sách có khoảng cách gần nhất
#cosin giá trị cao nhất
def top_k_idx(x, y, k):
    # print(x.shape, y.shape)
    cos_sim = cosine_similarity(x, y)
    # print(cos_sim)
    
    sort_sim = np.argsort(cos_sim)
    return sort_sim[-k:]

#59 thuộc tính trích xuất từ 32 thuộc tính bên trên
feature_order = ['genre_adult', 'genre_adventure', 'genre_art', 'genre_biography',
       'genre_bussiness', 'genre_children', 'genre_classics', 'genre_comedy',
       'genre_contemporary', 'genre_culture', 'genre_drama', 'genre_essays',
       'genre_family', 'genre_fantasy', 'genre_fiction', 'genre_history',
       'genre_horror', 'genre_lgbt', 'genre_literature', 'genre_mystery',
       'genre_nature', 'genre_non-fiction', 'genre_novel', 'genre_other',
       'genre_philosophy', 'genre_poetry', 'genre_politics', 'genre_religion',
       'genre_romance', 'genre_school', 'genre_science',
       'genre_science-fiction', 'genre_self-help', 'genre_short-stories',
       'genre_sociology', 'genre_tragedy', 'genre_young-adult', 'pages',
       'has_series', 'age', 'format_Audio', 'format_Audio CD',
       'format_Audio Cassette', 'format_Audiobook', 'format_Board Book',
       'format_Hardcover', 'format_Kindle Edition', 'format_Leather Bound',
       'format_Mass Market Paperback', 'format_Novelty Book',
       'format_Paperback', 'format_Poche', 'format_Taschenbuch',
       'format_Trade Paperback', 'format_Unknown Binding', 'format_cloth',
       'format_ebook', 'format_paper', 'format_softcover']
    
    
emb_size = 20

model = ANN(len(feature_order), emb_size)
model.load_state_dict(torch.load(f'models/book_rating_model_{emb_size}.pth'))
model.fc2 = nn.Identity()
model.eval()
    
scaler = StandardScaler()
scaler = joblib.load('models/scaler.save')

def get_embedding(mtrx):
    X = scaler.transform(mtrx)
    inp = torch.Tensor(X)
    
    emb = model(inp)
    # print(emb)
    return emb.detach().numpy()

ca = certifi.where()
client = pymongo.MongoClient(args.mongodb, tlsCAFile=ca, tls=True, tlsAllowInvalidCertificates=True)
shop_db = client.shop


app = Flask(__name__)
CORS(app)

api = Blueprint("Book", __name__)

@api.route('/health_check', methods=["POST", "GET"])
def heath_check():
    return jsonify("Recommendation service OK"), 200


@api.route('/rec_new', methods=['GET'])
def new_arrival():
    status = 200
    results = {}
    
    limit = request.args.get('limit', 10)
    print(limit)
    
    try:
        new_books = shop_db.copies.find({},{ "_id": 1, "publishYear": 1 }).sort('publishYear', -1).limit(int(limit))
        
        results = {
            'copy_ids': [str(x['_id']) for x in new_books]
        }
    except:
        status = 400
        results = {
            'error': 'Bad request'
        }

    return results, status


@api.route('/rec_bestsellers', methods=['GET'])
def bestsellers():
    status = 200
    results = {}
    
    limit = request.args.get('limit', 10)
    
    try:
        best_books = shop_db.copies.find({},{ "_id": 1, "sold": 1 }).sort('sold', -1).limit(int(limit))
        
        results = {
            'copy_ids': [str(x['_id']) for x in best_books]
        }
    except:
        status = 400
        results = {
            'error': 'Bad request'
        }

    return results, status


@api.route('/rec_genre', methods=['POST'])
def books_by_genre():
    content = request.data
    req = json.loads(content.decode('utf-8'))
    
    genre = req.get('genre')
    limit = req.get('limit', 0)
    
    status = 200
    results = {}
    
    
    if genre is None or limit == 0:
        status = 400
        results = {
            'error': 'Bad request'
        }
    else: 
        try:
            best_books = shop_db.copies.aggregate([
                {
                    "$lookup": {
                        "from": "books",
                        "localField": "bookId",
                        "foreignField": "_id",
                        "as": "book"
                    }
                },
                {
                    "$unwind": "$book"
                },
                {
                    "$match": {"book.genre": {"$in": [genre]}}  # Filter by genre containing 'fiction'
                },
                {
                    "$project": {
                        "_id": 1,  # Include other desired copy fields
                        "genre": "$book.genre",  # Project the genre field from the book
                        "sold": 1
                    }
                },
                {
                    "$sort": {"sold": -1}  
                },
                {
                    "$limit": int(limit)
                }
            ])
            
            results = {
                'copy_ids': [str(x['_id']) for x in best_books]
            }
        except:
            status = 408
            results = {
                'error': 'Error'
            }

    return results, status


@api.route('/rec_genre_cosine', methods=['POST'])
def books_content():
    content = request.data
    req = json.loads(content.decode('utf-8'))
    
    book_id = req.get('id')
    limit = req.get('limit', 0)
    
    status = 200
    results = {}
    
    
    if book_id is None or book_id.strip() == '' or limit == 0:
        status = 400
        results = {
            'error': 'Bad request'
        }
    else: 
        try:
            book_id = ObjectId(book_id)
            available_books = shop_db.copies.aggregate([
                {
                    "$lookup": {
                        "from": "books",
                        "localField": "bookId",
                        "foreignField": "_id",
                        "as": "book"
                    }
                },
                {
                    "$unwind": "$book"
                },
                {
                    "$match": {
                        "$or": [
                            {"inStock": {"$gt": 0}},
                            {"_id": book_id}
                        ]
                    }
                },
                {
                    "$project": {
                        "_id": 1,  # Include other desired copy fields
                        "genre": "$book.genre"
                    }
                }
            ])
            
            books = [x for x in available_books]
            books_df = pd.DataFrame(books).explode('genre') #bảng
            books_df_one_hot = pd.get_dummies(books_df, columns=['genre']).groupby('_id').sum() #vector genre, số genre = số chiều
            
            available_df = books_df_one_hot[books_df_one_hot.index != book_id]
            
            book_vector = books_df_one_hot[books_df_one_hot.index == book_id].to_numpy()
            books_vector = available_df.to_numpy()
            
            best_idx = top_k_idx(book_vector, books_vector, int(limit))
            #lấy id của các hàm có giá trị lớn nhất
            best_books = available_df.index.to_numpy()[best_idx]
            
            results = {
                'copy_ids': [str(x) for x in best_books]
            }
        except:
            status = 408
            results = {
                'error': 'Error'
            }

    return results, status


@api.route('/rec_book_cosine', methods=['POST'])
def books_embedding():
    content = request.data
    req = json.loads(content.decode('utf-8'))
    
    book_id = req.get('id')
    limit = req.get('limit', 0)
    
    status = 200
    results = {}
    
    
    if book_id is None or book_id.strip() == '' or limit == 0:
        status = 400
        results = {
            'error': 'Bad request'
        }
    else: 
        try:
            book_id = ObjectId(book_id)
            available_books = shop_db.copies.aggregate([
                {
                    "$lookup": {
                        "from": "books",
                        "localField": "bookId",
                        "foreignField": "_id",
                        "as": "book"
                    }
                },
                {
                    "$unwind": "$book"
                },
                {
                    "$match": {
                        "$or": [
                            {"inStock": {"$gt": 0}},
                            {"_id": book_id}
                        ]
                    }
                },
                {
                    "$project": {
                        "_id": 1,  # Include other desired copy fields
                        "genre": "$book.genre",  # Project the genre field from the book
                        'series': "$book.series",
                        'pages': 1, 
                        'format': 1, 
                        'publishYear':1
                    }
                }
            ])
            
            books = [x for x in available_books]
            books_df = pd.DataFrame(books)
            
            books_df['has_series'] = books_df['series'].isnull().astype('int')
            books_df['age'] = 2024 - books_df['publishYear']
            
            genre_df_one_hot = pd.get_dummies(books_df[['_id','genre']].explode('genre'), columns=['genre']).groupby('_id').sum() #vectorize genre
            format_df_one_hot = pd.get_dummies(books_df[['_id','format']].explode('format'), columns=['format']).groupby('_id').sum() #vectorize format
            
            feature_df = pd.concat([genre_df_one_hot, books_df[['_id','pages','has_series','age']].set_index('_id'), format_df_one_hot], axis=1)
            feature_df = feature_df[feature_order] #bảng 59 thuộc tính
            
            available_df = feature_df[feature_df.index != book_id]
            
            book_vector = feature_df[feature_df.index == book_id].to_numpy()
            books_vector = available_df.to_numpy()
            
            ft_mtrx = np.vstack([book_vector, books_vector])
            emb = get_embedding(ft_mtrx) #lấy embedding 32 chiều
            
            best_idx = top_k_idx(emb[0].reshape(1, -1), emb[1:], int(limit))
            print(best_idx)
            
            best_books = available_df.index.to_numpy()[best_idx]
            
            results = {
                'copy_ids': [str(x) for x in best_books]
            }
        except Exception as e:
            print(e)
            status = 408
            results = {
                'error': 'Error'
            }

    return results, status


app.register_blueprint(api, url_prefix="/")


if __name__ == '__main__':
    print("* STARTING WEB SERVICE...")
    app.secret_key = os.urandom(12)
    app.run(host=args.host, port=args.port, debug=True)