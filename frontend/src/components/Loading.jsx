import React from 'react';
import { Bars } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className="flex relative flex-col  justify-center items-center  h-screen">
            <h1 className='text-2xl absolute top-10 font-semibold'>Please wait ...</h1>

            <Bars color="#c0002099" height={80} width={80} />
        </div>
    );
}
