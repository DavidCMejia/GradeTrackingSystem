import {
  Button, Form, Input, Checkbox, Row, Col,
} from 'antd';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectCounter } from '../selectors/initialSelectors';
import { decrement, increment } from '../slices/counterSlice';

export default function Home() {
  const count = useSelector(selectCounter);
  const dispatch = useDispatch();

  return (
    <Row>
      <Col lg={{ span: 6, offset: 9 }}>
        <br />
        <h1>
          El contador esta en
          {' '}
          {count}
        </h1>
        <br />
        <br />
        <Button type="primary" onClick={() => dispatch(increment())}>
          Aumentar
        </Button>
        <Button type="default" onClick={() => dispatch(decrement())}>
          Disminuir
        </Button>
      </Col>
    </Row>
  );
}
