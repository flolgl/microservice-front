import {useEffect, useState} from "react"
import {NavBar} from "../components/NavBar"
import {Booking} from "../Types/Booking"
import "./styles/Personnes.css";
import {Logement} from "../Types/Logement";

export const Transactions = () => {
    const [bookingsEl, setBookingsEl] = useState<Array<JSX.Element>>([]);
    useEffect(() => {
        console.log("useEffect")
        Promise.all([
            buildBookings(),
        ])

    }, [])

    const fetchAllHousesOfUser = async (): Promise<Array<Logement>> => {
        const user = localStorage.getItem("user");
        if (user === null) {
            return [];
        }
        const userObj = JSON.parse(user);

        const res = await fetch(`http://localhost:8081/House/owner/${userObj.id}`)
        if (res.status !== 200)
            return [];
        return await res.json();
    }

    const fetchAllBookingsOfHouses = async (houses: Array<Logement>) => {
        const res = await fetch("http://localhost:8083/Booking/house/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(houses.map(house => house.id + ""))
        });
        return await res.json();
    }

    const buildBookings = async () => {
        const houses = await fetchAllHousesOfUser();
        const bookingsOfHouses = await fetchAllBookingsOfHouses(houses);
        const mappedLogements = bookingsOfHouses.map((booking: Booking, index: number) => {
            return buildPersonDiv(booking, index, bookingsOfHouses.length);
        });
        setBookingsEl(mappedLogements);
    }

    const handleConfirm = async (booking: Booking) => {
        const res = await fetch(`http://localhost:8083/Booking/${booking.id}/confirm`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isConfirmed: true})
        });
        if (res.status === 200)
            buildBookings();
    }

    const buildPersonDiv = (booking: Booking, index: number, max: number) => {
        return (
            <div key={booking.id} style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : index === max ? "1px solid #FFF" : "0"}}>
                <div style={{width:"8rem"}}>
                    <span>{booking.startDate}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{booking.endDate}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <span>{booking.houseId}</span>
                </div>
                <div style={{width:"8rem"}}>
                    <button onClick={() => {handleConfirm(booking)}} disabled={booking.isConfirmed} className={"button-job"}>{booking.isConfirmed ? "Confirmed" : "Confirm"}</button>
                </div>
            </div>
        )
    }



    return (
        <>
            <NavBar />
            <div style={{display: "flex", justifyContent: "center", margin: "1rem 3rem"}}>
                <div style={{border: "1px solid #FFF", borderRadius:"8px"}}>
                    <div style={{display: "flex", justifyContent:"space-evenly", gap: "3rem", padding:"1rem", borderBottom : "1px solid #FFF"}}>
                        <div style={{width:"8rem"}}>
                            <span>A partir du</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Jusqu'au</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Numéro de maison</span>
                        </div>
                        <div style={{width:"8rem"}}>
                            <span>Confirm</span>
                        </div>
                    </div>
                    {bookingsEl ? bookingsEl : <></>}
                </div>
            </div>
        </>

    )
}