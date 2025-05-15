import savingsbuddyImage from "../assets/savingsbuddy.png";

export default function LandingPage() {
    return (
        <div className="flex-1 flex items-center justify-center h-screen">
            <div className="flex flex-col md:flex-row items-center w-full max-w-7xl px-4 py-4 -mt-65">
                <div className="flex-1 flex flex-col items-center md:items-start max-w-[50%]">
                    <h1 style={{ fontSize: "70px" }} className="md:text-5xl font-semibold mb-6 leading-tight text-black">
                        <span className="inline-block pb-1 mb-1">Take Control of</span>
                        <br />
                        <span className="inline-block pb-1 mb-1">your Finances with</span>
                        <br />
                        <span className="inline-block border-b-4 border-blue-700 pb-1 mb-1">SavingsBuddy</span>
                    </h1>
                    <p className="mb-3 text-base text-gray-700">
                        An interactive and engaging way to budget and save money!
                    </p>
                    <button className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition duration-200 shadow">
                        TRY NOW
                    </button>
                </div>
                <div className="flex-1 flex justify-center items-center max-w-[50%]">
                    <img
                        src={savingsbuddyImage.src}
                        alt="SavingsBuddy"
                        className="w-full h-auto max-w-[500px] object-contain"
                    />
            </div>
        </div>
    </div>
    );
}
