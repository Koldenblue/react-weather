import React from 'react';
import { Card, Image } from 'react-bootstrap';

export default function ForecastCards(props: any) {

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {props.futureDate}
        </Card.Title>

        <Image src={props.iconURL} className='card-img-top' alt={`forecast for ${props.future} days out`} />

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
  )
}