'use client';

import { Button } from "@mui/material";

const Presenter = () => {
    return (
        <div className="w-[200px] h-[200px] bg-red-500">
            <Button variant="contained" className="bg-green-500 p-10 m-10">Hello</Button>
            <p>hello</p>
        </div >
    );
};

export default Presenter;