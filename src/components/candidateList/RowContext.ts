"use client"
import React from 'react';

// This context will hold the function to be called on button click and an initial placeholder function
const RowContext = React.createContext({
  onButtonClick: () => console.log("HELLO WORLD"),
});

export default RowContext;