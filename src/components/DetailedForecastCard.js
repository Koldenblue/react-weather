import React from 'react';
import { Card, ListGroup, Col } from 'react-bootstrap';

export default function DetailedForecastCard(props) {

  return (
    <Col lg={2}>
      <Card style={{ width: '14em' }} >
        <Card.Body className='detailed-conditions'>
          <Card.Title>
            {props.time}
          </Card.Title>

          <hr />
            <Card.Text>
              {props.weatherDescription}
            </Card.Text>

          <div className='smaller-text'>

            <ListGroup.Item>
              {props.weatherTemp}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.humidity}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.cloudCover}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.feelsLike}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.minTemp}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.maxTemp}
            </ListGroup.Item>

            <ListGroup.Item>
              {props.windSpeed}
            </ListGroup.Item>

          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}