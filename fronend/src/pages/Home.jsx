import Banner from './component/Banner';
import Sale from './component/Sales';

const Home = () => {
    return(
    <div className="w-full mx-auto pr-2 pl-2">
        <Banner/>
        <div className="max-w-container mx-auto px-4">
            <Sale/>
        </div>
    </div>
    );
}

export default Home;