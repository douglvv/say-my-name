import { Row, Col } from "react-bootstrap";
import CreateGameForm from "../components/CreateGameForm";

export default function CreateGameScreen() {

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Row sm={1} className="menu-container m-3 p-3">
                <Col>
                    <h1 className="title">Say my Name</h1>
                    <CreateGameForm />
                </Col>
            </Row>
        </div>
    );
}