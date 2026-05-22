from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional

router = APIRouter()

SCHEMES_DATABASE = [
    {
        "id": "pm-kisan",
        "name": "PM Kisan Samman Nidhi",
        "description": "Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.",
        "category": "Income Support",
        "benefits": [
            "₹6,000 per year paid in three equal installments of ₹2,000 directly into the bank accounts of farmers.",
            "100% funding from the Central Government of India.",
            "Helps meet financial requirements for agriculture inputs and household needs."
        ],
        "official_url": "https://pmkisan.gov.in/",
        "criteria": {
            "min_farm_size": 0.01,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    },
    {
        "id": "kcc",
        "name": "Kisan Credit Card (KCC)",
        "description": "Concessional and timely credit for farmers to meet their cultivation, post-harvest, and household consumption needs.",
        "category": "Credit",
        "benefits": [
            "Concessional interest rate of 4% per annum upon timely repayment of loans.",
            "Flexible credit limit based on landholding size, soil quality, and cropping pattern.",
            "Coverage for crop insurance and low-cost personal accident insurance.",
            "No collateral required for loans up to ₹1.6 Lakhs."
        ],
        "official_url": "https://www.myscheme.gov.in/schemes/kcc",
        "criteria": {
            "min_farm_size": 0.0,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    },
    {
        "id": "pmfby",
        "name": "PM Fasal Bima Yojana",
        "description": "Comprehensive crop insurance scheme protecting farmers against crop losses from natural calamities, pests, and diseases.",
        "category": "Insurance",
        "benefits": [
            "Extremely low premium rates: 1.5% for Rabi crops, 2.0% for Kharif crops, and 5% for commercial/horticultural crops.",
            "Full claim payout against verified yield losses based on weather and crop-cutting experiments.",
            "Covers post-harvest losses and localized calamities like hailstorms and landslides."
        ],
        "official_url": "https://pmfby.gov.in/",
        "criteria": {
            "min_farm_size": 0.0,
            "max_farm_size": None,
            "crops": ["Wheat", "Rice", "Mustard", "Soybean", "Chickpea", "Cotton", "Sugarcane"],
            "states": ["all"]
        }
    },
    {
        "id": "soil-health",
        "name": "Soil Health Card",
        "description": "Provides crop-wise fertilizer recommendations based on scientific soil testing, helping farmers optimize crop yields.",
        "category": "Soil",
        "benefits": [
            "Free detailed report of soil nutrient status (12 parameters: N, P, K, pH, etc.).",
            "Customized dosage recommendations for chemical and organic fertilizers.",
            "Improves soil fertility and reduces input cost by avoiding over-fertilization."
        ],
        "official_url": "https://www.soilhealth.dac.gov.in/",
        "criteria": {
            "min_farm_size": 0.0,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    },
    {
        "id": "enam",
        "name": "eNAM (National Agriculture Market)",
        "description": "A pan-India electronic trading portal networking existing APMC mandis to create a unified national market for agricultural commodities.",
        "category": "Marketplace",
        "benefits": [
            "Direct access to online buyers across the country, cutting middle-men margins.",
            "Real-time transparent price discovery based on local and national demand.",
            "Immediate digital payment settlement directly into bank accounts."
        ],
        "official_url": "https://www.enam.gov.in/",
        "criteria": {
            "min_farm_size": 0.0,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    },
    {
        "id": "fertilizer-subsidy",
        "name": "Fertilizer Subsidy (PM-PRANAM)",
        "description": "Statutory controlled chemical fertilizers like Urea and nutrient-based fertilizers like DAP are provided at heavily subsidized rates.",
        "category": "Subsidies",
        "benefits": [
            "Urea and DAP available at a fraction of their global market prices.",
            "Ensures uninterrupted supply of essential nutrients for crop growth.",
            "Promotes balanced fertilizer usage through PM-PRANAM alternative incentives."
        ],
        "official_url": "https://www.myscheme.gov.in",
        "criteria": {
            "min_farm_size": 0.0,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    },
    {
        "id": "pmksy",
        "name": "Pradhan Mantri Krishi Sinchayee Yojana",
        "description": "Focuses on developing irrigation infrastructure, water harvesting, and extending high-efficiency micro-irrigation systems to every farm.",
        "category": "Irrigation",
        "benefits": [
            "Subsidy up to 55% for Small/Marginal farmers and 45% for others on drip and sprinkler irrigation installations.",
            "Enhances water utilization efficiency ('More crop per drop').",
            "Reduces weeding costs and power consumption through precise water feeding."
        ],
        "official_url": "https://pmksy.gov.in/",
        "criteria": {
            "min_farm_size": 0.1,
            "max_farm_size": None,
            "crops": ["all"],
            "states": ["all"]
        }
    }
]

@router.get("")
def get_schemes(category: Optional[str] = None):
    """
    Get a list of all Indian agricultural schemes, optionally filtered by category.
    """
    if category and category.lower() != "all":
        filtered = [s for s in SCHEMES_DATABASE if s["category"].lower() == category.lower()]
        return filtered
    return SCHEMES_DATABASE

@router.get("/{scheme_id}")
def get_scheme(scheme_id: str):
    """
    Get details of a specific scheme by ID.
    """
    scheme = next((s for s in SCHEMES_DATABASE if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
