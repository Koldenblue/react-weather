import React from 'react';
import { Card } from 'react-bootstrap';

export default function ForecastCards(props: any) {

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {props.futureDate}
        </Card.Title>

        {props.weatherIcon}

        <Card.Text>
          <p>
            {props.cardText1}
          </p>
        </Card.Text>

        <Card.Text>
          <p>
            {props.cardText2}
          </p>
        </Card.Text>

        <Card.Text>
          <p>
            {props.cardText3}
          </p>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}