import React, { useEffect } from 'react';
import { useState } from 'react';
import { Card, Col, Divider, Flex, Layout, Menu, Row, Select} from 'antd';
import { FaCartShopping } from "react-icons/fa6";
import { DASHBOARD_SIDEBAR_LINKS} from '../const/Navigation';
import ProductComponent from './ProductComponent';
import { useNavigate, Outlet, useLocation} from 'react-router-dom';
import { formatNumber } from '../const/utils';
import { getStatistic } from '../service/serviceAPI';

const { Header, Content, Footer, Sider } = Layout;

const AdminHome = () => {
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalProductSale, setTotalProductSale] = useState(0);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth()+1);

  const fetchData = async() =>{
    const response = await getStatistic({month: month});
    if(response.status === 200){
      setTotalPayment(response.data.totalPayment);
      setTotalProductSale(response.data.totalProductSale);
    }
  }

  useEffect(()=>{
    fetchData()
  }, [])

  return (
    <div className='pt-4'>
      <Card title='Admin Dashboard'>
        <div className='px-5 pb-5 text-xl'>
          Statistics current month ({month})
        </div>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card title="Total Revenue">
                <div className='font-semibold text-lg'>{formatNumber(totalPayment)}</div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Subscriptions">
                <div className='font-semibold text-lg'>+0</div>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Sales">
                <div className='font-semibold text-lg'>+{formatNumber(totalProductSale)}</div>
              </Card>
            </Col>
          </Row>
        </div>
        <Divider/>

        <div>
              <Card title="About">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eget congue lorem, at sagittis augue. Nam vel est metus. Sed condimentum pulvinar faucibus. Duis convallis leo efficitur arcu ornare, vitae cursus erat interdum. Vestibulum in risus et odio ornare pulvinar. Morbi mi nisl, accumsan malesuada quam vitae, elementum pellentesque lacus. Integer vel magna blandit metus semper posuere. Etiam in ultricies mauris. Maecenas quis sem neque. Praesent nec imperdiet velit.

Duis a quam in risus luctus pellentesque at id eros. Maecenas vitae eleifend lectus. Donec dictum, nibh sit amet pulvinar consectetur, felis libero interdum turpis, vitae euismod dui augue a ante. Integer convallis hendrerit mi eu suscipit. Sed fringilla risus et nunc porta, vitae consequat libero faucibus. Curabitur magna lectus, hendrerit eleifend velit blandit, posuere hendrerit arcu. Maecenas luctus ipsum facilisis euismod cursus.

Vestibulum tincidunt nisi nunc. Maecenas egestas accumsan nulla vitae auctor. Donec varius libero vitae odio eleifend porttitor. Sed tempor neque quis dapibus blandit. Fusce lacinia nulla at urna fermentum, rutrum ultrices purus tempus. Nullam sit amet felis nec justo scelerisque rutrum id et velit. Fusce maximus ligula eget facilisis aliquam. Morbi mattis elit nec consectetur pulvinar. Fusce cursus in neque sed volutpat. Maecenas sed orci nec odio accumsan condimentum et eu eros. Nullam fermentum a lorem ornare gravida. Pellentesque vehicula, libero id porta pellentesque, mi mauris fringilla mauris, non maximus tellus enim a nisi. Pellentesque id velit at velit volutpat viverra eget ut nisl. Pellentesque lobortis diam in ipsum posuere interdum.

Morbi tempor id metus ac pretium. Phasellus sit amet eros elit. Nunc sed venenatis velit. Fusce cursus, nisi quis tristique viverra, velit lorem egestas mauris, ac vestibulum erat nisi quis arcu. Phasellus suscipit libero vitae justo interdum accumsan. Nulla facilisi. Praesent urna mauris, congue eget magna quis, pharetra hendrerit dui. Praesent nec metus et dolor faucibus dictum sed non magna. Nullam vel sem eget elit egestas sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Sed iaculis magna in quam commodo laoreet. Sed imperdiet faucibus vulputate. Nam dignissim mi arcu. Nam leo orci, tempus ac tortor eu, suscipit tempus sem. Phasellus elementum tellus mi, ut tristique ex accumsan ac. Phasellus semper tortor erat, ac elementum enim dignissim eget. Vestibulum commodo velit ipsum, quis interdum neque lobortis eu. Aliquam odio neque, rhoncus a arcu id, accumsan ornare lorem. Mauris ac turpis lacus. Mauris sapien ipsum, euismod sit amet ex at, imperdiet ultricies sem. Quisque ut vehicula elit, ut cursus tellus. Phasellus pulvinar tortor turpis, vel ullamcorper sapien lobortis quis. Phasellus a varius elit, nec venenatis sapien. Nulla quis ipsum vel enim vestibulum vulputate ut fermentum nisi. Aliquam porta enim eu dolor lobortis aliquet. Pellentesque faucibus finibus felis id placerat.
              </Card>
        </div>
        
      </Card>
    </div>
  )
}

export default AdminHome