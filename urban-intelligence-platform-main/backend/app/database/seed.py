import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.registry import Route, Bus, Device
from app.models.incidents import Incident
from app.models.alerts import Alert
from app.models.users import User
from app.auth.security import get_password_hash

def seed_database(db: Session):
    # 1. Seed Demo Users
    demo_users = [
        {"username": "admin", "password": "adminpassword", "role": "admin"},
        {"username": "traffic", "password": "trafficpassword", "role": "traffic_authority"},
        {"username": "municipal", "password": "municipalpassword", "role": "municipal_authority"}
    ]
    for user_data in demo_users:
        user = db.query(User).filter(User.username == user_data["username"]).first()
        if not user:
            new_user = User(
                username=user_data["username"],
                password_hash=get_password_hash(user_data["password"]),
                role=user_data["role"]
            )
            db.add(new_user)

    # 2. Seed Routes if empty
    if db.query(Route).count() == 0:
        routes_data = [
            {"id": "R-05", "route_number": "R-05", "name": "Airport Corridor Line", "origin": "Kempegowda Int. Airport", "destination": "MG Road Metro"},
            {"id": "R-12", "route_number": "R-12", "name": "Outer Ring Road Express", "origin": "Hebbal Flyover", "destination": "Silk Board Junction"},
            {"id": "R-18", "route_number": "R-18", "name": "Electronic City Elevated Express", "origin": "Majestic Central", "destination": "Electronic City Phase 2"},
            {"id": "R-24", "route_number": "R-24", "name": "Indiranagar - Whitefield ITPL Line", "origin": "Indiranagar 100ft", "destination": "ITPL Main Gate"},
            {"id": "R-09", "route_number": "R-09", "name": "South Urban Grid Line", "origin": "Banashankari TTMC", "destination": "Kengeri Satellite Town"},
            {"id": "R-33", "route_number": "R-33", "name": "North Metro Feeder Loop", "origin": "Yelahanka Old Town", "destination": "Yeshwantpur Junction"},
        ]
        for r in routes_data:
            db.add(Route(
                id=r["id"],
                route_number=r["route_number"],
                name=r["name"],
                origin=r["origin"],
                destination=r["destination"],
                is_active=True
            ))
        db.commit()

    # 3. Seed Buses if empty
    if db.query(Bus).count() == 0:
        buses_data = [
            {"id": "BUS-101", "bus_number": "BUS-101", "registration_number": "KA01F9912", "operator": "BMTC", "route_id": "R-05"},
            {"id": "BUS-102", "bus_number": "BUS-102", "registration_number": "KA04G8820", "operator": "BMTC", "route_id": "R-12"},
            {"id": "BUS-103", "bus_number": "BUS-103", "registration_number": "KA05E4401", "operator": "BMTC", "route_id": "R-18"},
            {"id": "BUS-104", "bus_number": "BUS-104", "registration_number": "KA03H1299", "operator": "BMTC", "route_id": "R-24"},
            {"id": "BUS-105", "bus_number": "BUS-105", "registration_number": "KA02J7734", "operator": "BMTC", "route_id": "R-09"},
            {"id": "BUS-108", "bus_number": "BUS-108", "registration_number": "KA01K3312", "operator": "BMTC", "route_id": "R-24"},
        ]
        for b in buses_data:
            db.add(Bus(
                id=b["id"],
                bus_number=b["bus_number"],
                registration_number=b["registration_number"],
                operator=b["operator"],
                route_id=b["route_id"],
                is_active=True
            ))
        db.commit()

    # 4. Seed Incidents if empty
    if db.query(Incident).count() == 0:
        now = datetime.now(timezone.utc)
        sample_incidents = [
            {
                "incident_id": "INC-1055",
                "event_id": "EVT-1055",
                "incident_type": "bus_footboard",
                "severity": "critical",
                "confidence": 0.95,
                "timestamp": now - timedelta(minutes=2),
                "latitude": 12.9784,
                "longitude": 77.5721,
                "bus_id": "BUS-108",
                "route_id": "R-24",
                "status": "open",
                "description": "Hazardous footboard travel detected: 4 commuters hanging outside rear passenger doors near Majestic station.",
            },
            {
                "incident_id": "INC-1054",
                "event_id": "EVT-1054",
                "incident_type": "wrong_way",
                "severity": "critical",
                "confidence": 0.96,
                "timestamp": now - timedelta(minutes=4),
                "latitude": 12.9341,
                "longitude": 77.6189,
                "bus_id": "BUS-102",
                "route_id": "R-12",
                "status": "open",
                "description": "Vehicle driving against one-way traffic flow on Koramangala 80-feet road divider junction.",
            },
            {
                "incident_id": "INC-1053",
                "event_id": "EVT-1053",
                "incident_type": "waterlogging",
                "severity": "high",
                "confidence": 0.93,
                "timestamp": now - timedelta(minutes=7),
                "latitude": 12.9141,
                "longitude": 77.6101,
                "bus_id": "BUS-108",
                "route_id": "R-24",
                "status": "open",
                "description": "Severe monsoon waterlogging (18cm depth, 35m stretch) submerging left lane at Silk Board underpass.",
            },
            {
                "incident_id": "INC-1052",
                "event_id": "EVT-1052",
                "incident_type": "pothole",
                "severity": "high",
                "confidence": 0.94,
                "timestamp": now - timedelta(minutes=11),
                "latitude": 12.9716,
                "longitude": 77.5946,
                "bus_id": "BUS-101",
                "route_id": "R-05",
                "status": "open",
                "description": "Cluster of 3 deep edge-potholes (max depth 12cm) in central lane outside Cubbon Park Metro gate 2.",
            },
            {
                "incident_id": "INC-1051",
                "event_id": "EVT-1051",
                "incident_type": "missing_crossing",
                "severity": "medium",
                "confidence": 0.89,
                "timestamp": now - timedelta(minutes=18),
                "latitude": 12.9352,
                "longitude": 77.6245,
                "bus_id": "BUS-104",
                "route_id": "R-24",
                "status": "open",
                "description": "Severely faded zebra crossing markings (<15% optical reflectivity remaining) at Sony World signal.",
            },
            {
                "incident_id": "INC-1050",
                "event_id": "EVT-1050",
                "incident_type": "rash_driving",
                "severity": "high",
                "confidence": 0.91,
                "timestamp": now - timedelta(minutes=24),
                "latitude": 12.9279,
                "longitude": 77.6271,
                "bus_id": "BUS-102",
                "route_id": "R-12",
                "status": "acknowledged",
                "description": "Aggressive rapid multi-lane weaving at 68 km/h in a 40 km/h zone near St. John's Hospital junction.",
            },
            {
                "incident_id": "INC-1049",
                "event_id": "EVT-1049",
                "incident_type": "missing_divider",
                "severity": "critical",
                "confidence": 0.97,
                "timestamp": now - timedelta(minutes=31),
                "latitude": 12.9172,
                "longitude": 77.6228,
                "bus_id": "BUS-103",
                "route_id": "R-18",
                "status": "open",
                "description": "Complete absence of median physical divider along 60m curve on Madiwala Lake road.",
            },
            {
                "incident_id": "INC-1048",
                "event_id": "EVT-1048",
                "incident_type": "illegal_parking",
                "severity": "medium",
                "confidence": 0.88,
                "timestamp": now - timedelta(minutes=39),
                "latitude": 12.9756,
                "longitude": 77.6068,
                "bus_id": "BUS-104",
                "route_id": "R-24",
                "status": "acknowledged",
                "description": "Commercial delivery van parked in active designated bus-bay causing transit bottlenecks on MG Road.",
            },
            {
                "incident_id": "INC-1047",
                "event_id": "EVT-1047",
                "incident_type": "hit_and_run",
                "severity": "critical",
                "confidence": 0.95,
                "timestamp": now - timedelta(minutes=48),
                "latitude": 12.9856,
                "longitude": 77.6407,
                "bus_id": "BUS-104",
                "route_id": "R-24",
                "status": "open",
                "description": "Sideswipe collision with two-wheeler followed by immediate high-speed departure toward 100ft Road.",
            }
        ]

        for inc in sample_incidents:
            db.add(Incident(**inc))
        db.commit()

        # 5. Seed Alerts for Critical / High Incidents
        for inc in sample_incidents:
            if inc["severity"] in ["high", "critical"]:
                db.add(Alert(
                    alert_id=f"ALT-{inc['incident_id']}",
                    incident_id=inc["incident_id"],
                    alert_type=inc["incident_type"],
                    severity=inc["severity"],
                    message=inc["description"],
                    status="unread" if inc["status"] == "open" else "acknowledged",
                    created_at=inc["timestamp"]
                ))
        db.commit()
