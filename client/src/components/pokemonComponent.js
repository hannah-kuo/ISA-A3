import Pokemon from "./pokemon";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiGetSinglePokemon } from "../api/pokeAPI";
import '../styles/app.css';


function PokemonPage({ currentPokemon, currentPage }) {

    const [individualPoke, setIndividualPoke] = useState("");

    const getMoreInfo = async (pokeID) => {
        apiGetSinglePokemon(pokeID)
            .then(res => res.data)
            .then(res => {
                setIndividualPoke(res);
            })
            .catch(err => console.log(err));
        renderMoreInfo(individualPoke[0]);
    };

    const formatExtraInformation = (singlePoke) => {
        return (
            <div className="extra-info">
                <Card.Text className="type">Type: {singlePoke.type.map((item) => ' ' + item)}</Card.Text>
                <Card.Text className="base-stats">Base Stats:</Card.Text>
                <div className="stats">
                    <div className="stat">
                        <Card.Text>HP</Card.Text>
                        <Card.Text>{singlePoke.base.HP}</Card.Text>
                    </div>
                    <div className="stat">
                        <Card.Text>Attack</Card.Text>
                        <Card.Text>{singlePoke.base.Attack}</Card.Text>
                    </div>
                    <div className="stat">
                        <Card.Text>Defence</Card.Text>
                        <Card.Text>{singlePoke.base.Defense}</Card.Text>
                    </div>
                </div>
            </div>
        );
    };

    const renderMoreInfo = (singlePoke) => {
        return (
            <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}> {singlePoke.name.english} </Card.Title>
                {formatExtraInformation(singlePoke)}
                <div style={{ textAlign: 'center' }}>
                    <Button
                        size="sm"
                        className="learn-more-button"
                        onClick={() => setIndividualPoke("")}
                    >
                        Minimize
                    </Button>
                </div>
            </Card.Body>
        );
    };

    const renderBasicCard = (item) => {

        return (
            <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}> {item.name.english} </Card.Title>
                <Pokemon key={item.id} pokemon={item} />
                <div style={{ textAlign: 'center' }}>
                    <Button
                        size="sm"
                        className="learn-more-button"
                        onClick={() => getMoreInfo(item.id)}
                    >
                        Learn More
                    </Button>
                </div>
            </Card.Body>
        )
    };

    return (
        <div>

            <h1 style={{ textAlign: 'center' }}>
                Page {currentPage}
            </h1>

            <Container>
                <Row xs={2} md={5}>
                    {currentPokemon.map(item => (
                        <Col>
                            <Card>
                                {individualPoke && individualPoke[0].id === item.id ? renderMoreInfo(item) : renderBasicCard(item)}

                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>

        </div>
    );
};

export default PokemonPage;