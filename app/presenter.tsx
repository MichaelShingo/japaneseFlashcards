'use client';

import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";

const Presenter = () => {
    const { user } = useUser();
    return (
        <div className="w-[200px] h-[200px] bg-red-500">
            <Button variant="contained" className="bg-green-500 p-10 m-10">Hello {user.name}</Button>
            <p>hello</p>
        </div >
    );
};

export default Presenter;