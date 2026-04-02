import type { Metadata } from "next";
import { companyInfo } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-[#f0f2f5] mb-8">Ochrana osobných údajov</h1>
        <div className="bg-[#0c1221] rounded-2xl border border-white/5 p-8 space-y-6 text-[#94a3b8] leading-relaxed text-sm">
          <p>Prevádzkovateľ: <strong className="text-[#f0f2f5]">{companyInfo.name}</strong>, {companyInfo.address}, {companyInfo.city}, IČO: {companyInfo.ico}</p>
          <p>Kontaktný email pre otázky o ochrane údajov: <a href="mailto:kcars@kcars.sk" className="text-[#f87171]">kcars@kcars.sk</a></p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Aké údaje spracúvame</h2>
          <p>Pri odoslaní kontaktného formulára alebo rezervácie obhliadky spracúvame: meno, e-mail, telefónne číslo, a vašu správu. Tieto údaje používame výlučne na vybavenie vašej požiadavky.</p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Právny základ</h2>
          <p>Spracúvanie je založené na vašom súhlase (čl. 6 ods. 1 písm. a) GDPR) a na oprávnenom záujme prevádzkovateľa (čl. 6 ods. 1 písm. f) GDPR).</p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Doba uchovávania</h2>
          <p>Osobné údaje uchovávame po dobu nevyhnutnú na vybavenie vašej požiadavky, najviac 3 roky.</p>
          <h2 className="text-lg font-semibold text-[#f0f2f5] pt-4">Vaše práva</h2>
          <p>Máte právo na prístup k údajom, opravu, vymazanie, obmedzenie spracúvania, prenositeľnosť údajov a právo podať sťažnosť na Úrad na ochranu osobných údajov SR.</p>
        </div>
      </div>
    </div>
  );
}
