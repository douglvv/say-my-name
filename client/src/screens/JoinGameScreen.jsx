import React from "react";
import { Row, Col } from "react-bootstrap";
import JoinGameForm from "../components/JoinGameForm";

export default function JoinGameScreen() {

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Row sm={1} className="menu-container m-3 p-3">
                <Col>
                    <h1 className="title">Say my Name</h1>
                    <JoinGameForm />
                </Col>
            </Row>
        </div>
    );
};