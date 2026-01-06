// src/components/website/PageSections/CartPage/CartItemDetailsModal.tsx

import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CartItem } from "@/lib/types/cart";
import SelectedConfiguration from "../ProductsPage/SelectedConfiguration";
import Image from "next/image";

interface CartItemDetailsModalProps {
    item: CartItem | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetailsContent = ({ item }: { item: CartItem }) => {
    const product = item.product;
    if (!product || !product.productId) return null;

    const selectedFeature = product.selectedFeature;
    const imageUrl = product.productId.productImage?.[0]?.url;

    if (!selectedFeature) {
        return (
            <p className="text-center text-red-500">
                Configuration details not found in cart data.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b">
                {imageUrl && (
                    <div className="w-1/3 aspect-square relative rounded-lg overflow-hidden border">
                        <Image
                            src={imageUrl}
                            alt={product.productId.productName}
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900">
                        {product.productId.productName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 uppercase">
                        {product.productId.family}
                    </div>
                </div>
            </div>
            <SelectedConfiguration
                selectedFeature={selectedFeature}
                measureUnit={product.productId.measureUnit}
            />
        </div>
    );
};

const ServiceDetailsContent = ({ item }: { item: CartItem }) => {
    const service = item.serviceId;
    if (!service) return null;

    return (
        <div className="space-y-6">
            <div className="flex gap-4 items-start pb-4 border-b">
                {service.imageUrl && (
                    <div className="w-1/3 aspect-square relative rounded-lg overflow-hidden border">
                        <Image
                            src={service.imageUrl}
                            alt={service.templateName}
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <div className="font-bold text-xl text-gray-900 uppercase">
                        {service.templateName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 uppercase">
                        {service.serviceType} Service
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
                    <div className="text-gray-500 text-xs mb-1">Material</div>
                    <div className="font-semibold text-gray-900 uppercase">
                        {service.material || "N/A"}
                    </div>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
                    <div className="text-gray-500 text-xs mb-1">Diameter</div>
                    <div className="font-semibold text-gray-900">{service.diameter}mm</div>
                </div>
                <div className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10">
                    <div className="text-gray-500 text-xs mb-1">Units</div>
                    <div className="font-semibold text-gray-900">{service.units}</div>
                </div>

                {service.sizes &&
                    Object.entries(service.sizes).map(([key, value]) => (
                        <div
                            key={key}
                            className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10"
                        >
                            <div className="text-gray-500 text-xs mb-1 uppercase">
                                Size {key}
                            </div>
                            <div className="font-semibold text-gray-900">{value}mm</div>
                        </div>
                    ))}

                {service.degrees &&
                    Object.entries(service.degrees).map(([key, value]) => (
                        <div
                            key={key}
                            className="bg-white p-3 rounded-lg border-2 border-[#7E1800]/10"
                        >
                            <div className="text-gray-500 text-xs mb-1">Degree {key}</div>
                            <div className="font-semibold text-gray-900">{value}°</div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const CartItemDetailsModal: React.FC<CartItemDetailsModalProps> = ({
    item,
    isOpen,
    onClose,
}) => {
    if (!item) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-2xl rounded-2xl p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-8 h-8 bg-[#7E1800] text-white rounded-full flex items-center justify-center text-sm">
                            ℹ
                        </span>
                        Item Details
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
                    {item.type === "product" && <ProductDetailsContent item={item} />}

                    {item.type === "service" && <ServiceDetailsContent item={item} />}
                </div>

                <AlertDialogFooter className="mt-6">
                    <AlertDialogAction
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-[#7E1800] text-white font-semibold hover:bg-[#961D00] transition active:scale-[0.98] cursor-pointer"
                    >
                        Close
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CartItemDetailsModal;
