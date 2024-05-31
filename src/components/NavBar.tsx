import { NavLink } from "react-router-dom"

export const NavBar = () => (
    <div style={{...ContainerCenter, ...NavBarStyle}}>
        <div style={Container}>
            <NavLink to={"/logements"} style={styleLinks}>Available houses</NavLink>
            <NavLink to={"/my-bookings"} style={styleLinks}>My bookings</NavLink>
            <NavLink to={"/my-houses"} style={styleLinks}>My houses</NavLink>
            <NavLink to={"/add-house"} style={styleLinks}>Add a house</NavLink>
        </div>
    </div>
)

const ContainerCenter = {display: "flex", justifyContent:"center", padding:"1rem"}
const NavBarStyle =  {backgroundColor : "#555555"}
const styleLinks = {color: "#FFFFFF"}
const Container = {display: "flex", justifyContent:"space-between", gap:"3rem"}