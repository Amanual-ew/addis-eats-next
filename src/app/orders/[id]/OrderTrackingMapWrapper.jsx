"use client";
 
import dynamic from "next/dynamic";
 
const OrderTrackingMap = dynamic(() => import("./OrderTrackingMap.client"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-lg bg-gray-200" />
  ),
});
 
export default function OrderTrackingMapWrapper(props) {
  return <OrderTrackingMap {...props} />;
}
 