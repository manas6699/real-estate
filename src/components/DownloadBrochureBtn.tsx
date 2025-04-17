import { FileDown } from 'lucide-react';

export default function DownloadBrochureButton() {
    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-20 mb-10">
            <button className="inline-flex items-center gap-3 px-10 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all w-fit">
                <FileDown className="w-7 h-7 md:w-9 md:h-9" />
                <div className="flex flex-col leading-tight text-left">
                    <span className="text-[10px] md:text-xs font-medium text-white/80">Download</span>
                    <span className="text-sm md:text-base font-semibold">Brochure</span>
                </div>
            </button>

            <div className="flex-1">
                <p className="font-semibold text-gray-600 text-sm md:text-base leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga blanditiis cumque
                    exercitationem nostrum illo nulla ad fugiat aliquam debitis magni. Lorem ipsum
                    dolor sit, amet consectetur adipisicing elit. Corporis, saepe fugit nesciunt
                    quasi aperiam cum repellendus accusamus ea molest
                </p>
            </div>
        </div>

    );
}
