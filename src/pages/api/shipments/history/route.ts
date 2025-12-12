// app/api/shipments/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ShipmentModel } from '@/lib/models/shipmentModel';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopUrl = searchParams.get('shopUrl');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!shopUrl) {
      return NextResponse.json(
        { error: 'shopUrl est requis' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [shipments, total] = await Promise.all([
      ShipmentModel.find({ shopUrl })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('orderId orderNumber customer carrier trackingNumber trackingUrl status shippingCost createdAt')
        .lean(),
      
      ShipmentModel.countDocuments({ shopUrl })
    ]);

    return NextResponse.json({
      shipments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération historique:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}