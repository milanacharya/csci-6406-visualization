import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

/* Navigation bar at every page*/
function Navigation() {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src="/covid19.png"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    COVID-19 Dashboard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <NavDropdown title="Global Trends" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/">Cumulative Figures</NavDropdown.Item>
                            <NavDropdown.Item href="/timeseries">Corona Spread Timeseries</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/canadatrends">Canada Trends</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}

export default Navigation;