

const BookForm = ({record, open}) =>{
    const items = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            disabled: true,
            rule: [
                {
                    required: true,
                    message: "Title of book isn's allow to blank"
                }
            ]
        },
        {
            title: 'Authors',
            dataIndex: 'authors',
            key: 'authors',
            disabled: true,
            rule: [
                {
                    required: true,
                    message: "Title of book isn's allow to blank"
                }
            ]
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre'
        },
        {
            title: 'Serires',
            dataIndex: 'serires',
            key: 'serires'
        }
    ]


    return(
        <Modal
        forceRender
        width={1000}
        destroyOnClose={true}
        maskClosable={true}
        title={propModal.title}
        open={visible}
        onCancel={() => setVisible(false)}
        />
    )
}

