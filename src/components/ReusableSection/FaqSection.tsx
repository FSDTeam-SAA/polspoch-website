"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqData = [
  {
    question: "¿Puedo realizar la devolución de un producto?",
    answer:
      "Dado que todos nuestros productos de hierro y acero se cortan a medida según las especificaciones de cada cliente, no admitimos devoluciones ni cambios por error en el pedido. Únicamente aceptamos reclamaciones si el material llega en mal estado (por ejemplo, si presenta golpes o deformaciones por el transporte). Te recomendamos revisar detalladamente las medidas antes de finalizar tu compra.",
  },
  {
    question: "¿Puedo recibir mi pedido directamente en casa o en mi obra?",
    answer:
      "Sí, pero debes tener en consideración las dimensiones y el peso del material que estás pidiendo:\n• Piezas inferiores a 2,5 metros: Se entregan mediante servicio de mensajería estándar, siempre y cuando el peso total del bulto lo permita.\n• Piezas superiores a 2,5 metros o de gran tonelaje: La entrega se realizará mediante un camión. Es imprescindible que te asegures de que este tipo de vehículo puede acceder sin problemas a la calle o finca de la dirección de entrega facilitada.",
  },
  {
    question: "¿A qué zonas hacéis envíos?",
    answer:
      "Realizamos envíos a toda la Península Ibérica. Repartimos nuestro hierro y acero tanto en grandes ciudades (Madrid, Barcelona, Valencia, Sevilla, Bilbao, A Coruña, Zaragoza, etc.) como en cualquier pueblo o polígono de la España peninsular. Al tramitar tu compra, solo debes asegurarte de que el método de envío seleccionado es compatible con las dimensiones de tu producto. (Nota: Actualmente no enviamos a Baleares, Canarias, Ceuta ni Melilla).",
  },
  {
    question: "¿Cómo puedo saber si el camión de reparto tiene acceso a mi dirección?",
    answer:
      "Para pedidos de gran tamaño, el reparto se suele realizar en un camión rígido de 3 ejes. Como norma general, debes verificar que la vía de acceso no tenga restricciones de tonelaje y permita las maniobras de un vehículo con estas medidas aproximadas:\n• Largo: Entre 10 y 11 metros.\n• Ancho: 2,55 metros.\n• Alto: Hasta 4 metros.\n• Peso Máximo Autorizado (MMA): 26 toneladas. Si tienes dudas sobre el acceso, contáctanos antes de realizar el pedido para buscar alternativas.",
  },
  {
    question: "¿Quién se encarga de descargar el material del camión?",
    answer:
      "Para los pedidos entregados por mensajería (piezas pequeñas), el repartidor entregará el paquete a pie de calle. Para pedidos de gran volumen enviados por camión, la descarga debe ser realizada por el cliente (mediante carretilla elevadora, puente grúa o personal suficiente)",
  },
  {
    question: "¿El hierro se entrega limpio o puede presentar algo de óxido?",
    answer:
      "El hierro negro o acero al carbono en su estado natural (sin galvanizar ni pintar) es susceptible de presentar una ligera capa de óxido superficial debido a la humedad del ambiente durante el almacenamiento. Esto es completamente normal en el sector metalúrgico, no afecta a las propiedades estructurales del material y desaparece al lijar o aplicar una imprimación antes de pintar.",
  },
  {
    question: "¿Existe algún margen de error en los cortes a medida?",
    answer:
      "Sí, trabajamos con maquinaria de alta precisión, pero en el corte industrial de metales siempre existe una tolerancia estándar que suele rondar los +/- 1 a 2 milímetros. Ten en cuenta este pequeño margen a la hora de calcular las piezas para tus proyectos o estructuras.",
  },
  {
    question: "¿Cuánto tardará en llegar mi pedido?",
    answer:
      "El tiempo de preparación para materiales cortados a medida suele ser de 1 a 2 días laborables. Una vez procesado y cortado, el tiempo de tránsito del transporte oscila entre 2 o 4 días laborables adicionales, dependiendo de si el envío es por mensajería estándar o agencia de transporte pesado.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="bg-[#F8F9FA]">
      <div className="mx-auto container py-16 ">
        <div className=" flex flex-col text-center justify-center mb-8">
          <h2 className="text-xl sm:text-3xl font-semibold mb-2">
            Preguntas Frecuentes (FAQ)
          </h2>
          <p className=" text-sm sm:text-base text-gray-500">
            Intentamos responder todas tus dudas
          </p>
        </div>
        <div className=" ">
          <div className="flex flex-col rounded-xl ">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`px-6 py-5 cursor-pointer ${index !== faqData.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                onClick={() => toggleFaq(index)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base md:text-lg font-medium text-[#343A40]">
                    {faq.question}
                  </h3>

                  {/* Icon */}
                  <span className="flex items-center justify-center w-7 h-7 border border-primary rounded-full text-primary transition-all duration-300">
                    {activeIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </div>

                {/* Answer */}
                {activeIndex === index && (
                  <p className="mt-3 text-[#68706A] leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
