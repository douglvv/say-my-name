import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { InputGroup, Form, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { updateGameState, updatePlayerState, setPlayerId } from '../redux/gameSlice';

const HomeScreen = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socket = useContext(SocketContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const playerState = useSelector((state) => state.game.player);

    useEffect(() => {
        // Connection
        const handleConnection = (data) => {
            const id = data.id;

            setIsConnected(true);
            dispatch(setPlayerId({ id: id }));
        };
        socket.on("connection", handleConnection);

        return () => {
            socket.off("connection", handleConnection);
        };
    }, [socket, dispatch, playerState]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">           
            <Row sm={1} className="menu-container m-3 p-3">
                <Col >
                    <h1 className="title">Say my Name</h1>
                    <div className="d-grid gap-2 mb-3">
                            <Button onClick={() => navigate('/game/create')} variant="primary" type="button" size="lg">
                                Create new game
                            </Button>

                            <Button onClick={() => navigate('/game/join')} variant="primary" type="button" size="lg">
                                Join existing game
                            </Button>
                        </div>
                    {isConnected
                        ? <p className="text-end small text-success">Connection to socket.io server successful</p>
                        : <p className="text-end small text-danger">Connection to socket.io server failed</p>
                    }
                </Col>
            </Row>
        </div>
    );
};

// TODO: error messages


export default HomeScreen;