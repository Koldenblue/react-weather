import React from 'react';
import { Card, Image, Col } from 'react-bootstrap';

export default function ForecastCards(props: any) {

  return (
    <Col lg={2}>
      <Card style={{ width: '12em' }} >
        <Card.Body className='current-conditions'>
          <Card.Title>
            {props.futureDate}
          </Card.Title>

          <Image src={props.iconURL} className='card-img-top current-weather-icon' alt={`forecast for ${props.future} day(s) out`} />

          <Card.Text>
            {props.cardText1}
          </Card.Text>

          <Card.Text>
            {props.cardText2}
          </Card.Text>

          <Card.Text>
            {props.cardText3}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}