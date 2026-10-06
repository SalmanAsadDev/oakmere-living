"use client";
export default function ErrorPage({reset}: {reset:()=>void}) { return <section className="container section"><h1 className="display text-4xl">Something didn’t load.</h1><p className="my-6">Your basket is still saved on this device. Please try again.</p><button className="bg-primary px-6 py-3 text-white" onClick={reset}>Try again</button></section>; }
