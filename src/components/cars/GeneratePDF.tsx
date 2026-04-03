"use client";

import { Car } from "@/types";

interface GeneratePDFProps {
  car: Car;
  monthlyPayment?: number;
  downPaymentPct?: number;
  months?: number;
}

export default function GeneratePDF({ car, monthlyPayment, downPaymentPct = 20, months = 48 }: GeneratePDFProps) {
  async function generate() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const w = doc.internal.pageSize.getWidth();

    // Header — dark background
    doc.setFillColor(6, 10, 18);
    doc.rect(0, 0, w, 45, "F");

    // Fire gradient line
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 45, w / 2, 2, "F");
    doc.setFillColor(249, 115, 22);
    doc.rect(w / 2, 45, w / 2, 2, "F");

    // Logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("K cars", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("www.kcars.sk  |  +421 905 489 662", 20, 35);

    // Title
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("CENOVÁ PONUKA", w - 20, 20, { align: "right" });
    doc.setFontSize(8);
    doc.text(new Date().toLocaleDateString("sk-SK"), w - 20, 27, { align: "right" });
    doc.text(`Platnosť: 14 dní`, w - 20, 33, { align: "right" });

    // Car info
    let y = 60;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(`${car.brand} ${car.model}`, 20, y);

    y += 12;
    doc.setFontSize(24);
    doc.setTextColor(239, 68, 68);
    doc.text(`${car.price.toLocaleString()} €`, 20, y);

    // Specs table
    y += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);

    const specs = [
      ["Rok výroby", String(car.year)],
      ["Najazdené", `${car.mileage.toLocaleString()} km`],
      ["Výkon", `${car.power_kw} kW (${Math.round(car.power_kw * 1.36)} HP)`],
      ["Palivo", car.fuel === "petrol" ? "Benzín" : car.fuel === "diesel" ? "Diesel" : car.fuel === "electric" ? "Elektro" : "Hybrid"],
      ["Prevodovka", car.transmission === "automatic" ? "Automat" : "Manuál"],
      ["Karoséria", car.body_type || "—"],
      ["Farba", car.color || "—"],
    ];

    doc.setFillColor(245, 245, 245);
    doc.rect(15, y - 5, w - 30, specs.length * 10 + 5, "F");

    for (const [label, value] of specs) {
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(label, 25, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(value, 100, y);
    }

    // Payment calculator section
    if (monthlyPayment) {
      y += 20;
      doc.setFillColor(239, 68, 68);
      doc.rect(15, y - 5, w - 30, 2, "F");

      y += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text("Kalkulácia splátok", 20, y);

      y += 12;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const downPayment = Math.round(car.price * downPaymentPct / 100);
      const loanAmount = car.price - downPayment;

      const paymentRows = [
        ["Cena vozidla", `${car.price.toLocaleString()} €`],
        ["Akontácia", `${downPaymentPct}% (${downPayment.toLocaleString()} €)`],
        ["Výška úveru", `${loanAmount.toLocaleString()} €`],
        ["Počet splátok", `${months} mesiacov`],
        ["Mesačná splátka", `${Math.round(monthlyPayment).toLocaleString()} €`],
      ];

      for (const [label, value] of paymentRows) {
        y += 8;
        doc.setTextColor(100, 100, 100);
        doc.text(label, 25, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 30, 30);
        doc.text(value, 120, y);
        doc.setFont("helvetica", "normal");
      }

      y += 8;
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text("* Orientačný výpočet, VÚB Banka. Skutočné podmienky závisia od bonity klienta.", 25, y);
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 25;
    doc.setFillColor(6, 10, 18);
    doc.rect(0, footerY - 5, w, 30, "F");
    doc.setFillColor(239, 68, 68);
    doc.rect(0, footerY - 7, w / 2, 2, "F");
    doc.setFillColor(249, 115, 22);
    doc.rect(w / 2, footerY - 7, w / 2, 2, "F");

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text("K cars s.r.o. | Eliášovce 80, Nový Život 930 38 | IČO: 52 792 056", 20, footerY + 5);
    doc.text("Tel: +421 905 489 662 | Email: kcars.kcars1@gmail.com | www.kcars.sk", 20, footerY + 12);

    // Save
    const filename = `KCars_${car.brand}_${car.model}_${car.year}.pdf`.replace(/\s+/g, "_");
    doc.save(filename);
  }

  return (
    <button
      onClick={generate}
      className="w-full bg-[#111a2e] border border-white/5 text-[#8b9bb4] hover:text-[#f0f2f5] hover:border-white/10 font-medium py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Stiahnuť cenovú ponuku (PDF)
    </button>
  );
}
