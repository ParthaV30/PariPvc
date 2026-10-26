import axios from 'axios';

export const DEFAULT_COST_DATA = {
  status: 'success',
  data: {
    costData: {
      handle: [
        { label: 'Single Point Handle', value: 120 },
        { label: 'Multi Point Cockspur Handle', value: 180 },
        { label: 'D-Handle Premium', value: 240 }
      ],
      mpl: [
        { label: 'Single Point Lock', value: 150 },
        { label: 'Multi Point Lock (MPL) Standard', value: 280 },
        { label: 'High Security MPL', value: 450 }
      ],
      tdHinges: [
        { label: '2D Adjustable Hinges', value: 140 },
        { label: '3D Heavy Duty Hinges', value: 220 },
        { label: 'Stainless Steel Butt Hinges', value: 180 }
      ],
      glass: [
        { label: '5mm Clear Float Glass', value: 65 },
        { label: '6mm Toughened Glass', value: 110 },
        { label: '5+9A+5 DGU Double Glazed', value: 195 },
        { label: 'Frosted Privacy Glass', value: 85 }
      ],
      margin: [
        { label: 'Standard Margin (20%)', value: 20 },
        { label: 'Competitive Margin (15%)', value: 15 },
        { label: 'Premium Margin (25%)', value: 25 }
      ],
      marketing: [
        { label: 'Standard Marketing (5%)', value: 15 },
        { label: 'Minimal (2%)', value: 10 }
      ],
      labourFactory: [
        { label: 'Standard Factory Fabrication', value: 45 },
        { label: 'Complex Assembly', value: 65 }
      ],
      labourSite: [
        { label: 'Standard Site Installation', value: 35 },
        { label: 'High-Rise Installation', value: 55 }
      ],
      transport: [
        { label: 'Local Transport (Chennai City)', value: 15 },
        { label: 'Suburban Transport', value: 25 },
        { label: 'Outstation Transport', value: 45 }
      ],
      steel: [
        { label: '1.2mm Galvanized Steel', value: 55 },
        { label: '1.5mm Heavy Duty Steel', value: 75 },
        { label: '2.0mm Structural Steel', value: 95 }
      ],
      grill: [
        { label: 'Powder Coated Safety Grill', value: 150 },
        { label: 'SS Safety Grill', value: 280 }
      ],
      wastage: [
        { label: 'Standard Wastage (5%)', value: 5 },
        { label: 'Low Wastage (3%)', value: 3 },
        { label: 'Buffer Wastage (7%)', value: 7 }
      ],
      profileGasket: [
        { label: 'EPDM Frame Gasket Black', value: 12 },
        { label: 'EPDM Frame Gasket Grey', value: 15 },
        { label: 'TPE Co-extruded Gasket', value: 18 }
      ],
      meshGasket: [
        { label: 'Standard Mesh Gasket', value: 10 },
        { label: 'Heavy Duty Mesh Gasket', value: 14 }
      ],
      mesh: [
        { label: 'Fiberglass Insect Screen', value: 45 },
        { label: 'SS 304 High Tensile Mesh', value: 85 },
        { label: 'Pet Resistant Mesh', value: 120 }
      ],
      screws: [
        { label: 'SS 410 Fasteners & Screws', value: 8 },
        { label: 'High Grade Self-Tapping Screws', value: 12 }
      ],
      securityClip: [
        { label: 'Standard Security Clip', value: 15 },
        { label: 'Reinforced Security Clip', value: 25 }
      ],
      runnerBlock: [
        { label: 'Nylon Runner Block', value: 25 },
        { label: 'Heavy Duty Runner Block', value: 40 }
      ],
      espag: [
        { label: 'Standard Espagnolette Gear', value: 180 },
        { label: 'High Security Espag Rod', value: 260 }
      ],
      espagm: [
        { label: 'Espag Screws & Fasteners', value: 5 }
      ],
      frictionStay: [
        { label: '10 Inch Friction Stay', value: 140 },
        { label: '12 Inch Heavy Friction Stay', value: 175 },
        { label: '16 Inch High Load Stay', value: 240 }
      ],
      mullionClamp: [
        { label: 'Die-cast Mullion Connector', value: 30 },
        { label: 'Heavy Steel Mullion Clamp', value: 45 }
      ],
      meshJA: [
        { label: 'Standard Mesh Joint Adaptor', value: 40 }
      ],
      wStrip: [
        { label: 'Wool Pile Weather Strip 5x6mm', value: 8 },
        { label: 'Fin Weather Strip 5x9mm', value: 12 }
      ],
      touchLock: [
        { label: 'Crescent Touch Lock', value: 95 },
        { label: 'Concealed Touch Latch', value: 145 }
      ],
      interLock: [
        { label: 'Sliding Interlock Profile', value: 50 }
      ],
      roller: [
        { label: 'Single Brass Bearing Roller', value: 55 },
        { label: 'Double Nylon Bearing Roller', value: 85 },
        { label: 'Heavy Duty Tandem Roller', value: 135 }
      ],
      waterCap: [
        { label: 'UPVC Drainage Water Cap', value: 5 }
      ],
      blades: [
        { label: 'Standard UPVC Louver Blades', value: 40 },
        { label: 'Adjustable Louver Blades', value: 65 }
      ],
      fan: [
        { label: 'Exhaust Fan Cutout Provision', value: 250 }
      ],
      board: [
        { label: 'Single Skin PVC Panel', value: 80 },
        { label: 'Double Skin Insulated Board', value: 140 }
      ],
      alTrack: [
        { label: 'Anodized Aluminum Rail Track', value: 65 }
      ],
      gRoll: [
        { label: 'Anti-Lift Guide Roller', value: 35 }
      ],
      meshRoll: [
        { label: 'Sliding Mesh Roller', value: 45 }
      ],
      bArrestor: [
        { label: 'Rubber Buffer Arrestor', value: 20 }
      ],
      jStopper: [
        { label: 'Door Jamb Stopper', value: 25 }
      ],
      dArrestor: [
        { label: 'Sash Door Arrestor', value: 30 }
      ],
      adjRoll: [
        { label: 'Height Adjustable Roller', value: 90 }
      ],
      doorStopper: [
        { label: 'Magnetic Floor Door Stopper', value: 120 }
      ],
      casementDoorset: [
        { label: 'Casement Door Lock & Handle Set', value: 850 }
      ]
    }
  }
};

export async function fetchCostDataService(user = null) {
  try {
    const res = await axios.post('https://upvcapi.sninfoserv.com/costs/', user || {}, { timeout: 3000 });
    if (res?.data?.data?.costData) {
      return res.data.data;
    }
  } catch (e) {
    // API offline or unreachable, fall back seamlessly
  }
  return DEFAULT_COST_DATA.data;
}

export function getSafeCostData(costData) {
  if (costData && typeof costData === 'object' && costData.costData) {
    return costData;
  }
  return DEFAULT_COST_DATA.data;
}
