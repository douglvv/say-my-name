import React, { useEffect, useState, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Container, Form, Button } from "react-bootstrap";

const HomeScreen = () => {
    const [isConnected, setIsConnected] = useState(false);
    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleConnection = () => {
            setIsConnected(true);
        };

        socket.on("connection", handleConnection);

        return () => {
            socket.off("connection", handleConnection);
        };
    }, []);

    return (
        <Container className="d-flex justify-content-center align-items-center" fluid="sm">
            {isConnected ? <p>Connected to socket.io server</p> : <p>Disconnected from socket.io server</p>}
        </Container>
    );
};


export default HomeScreen;