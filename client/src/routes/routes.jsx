import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "../screens/HomeScreen";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" Component={HomeScreen} />
            </Routes>
        </Router>
    );
};