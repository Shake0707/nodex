'use client';

export default function SurveyError({ reset }: { reset: () => void }) {
    return (
        <div className="survey-page">
            <div className="survey-page__inner relative z-10 flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                <p className="section-label">Survey</p>
                <h1 className="survey-event-title" style={{ fontSize: '1.5rem' }}>
                    Xizmat vaqtincha mavjud emas
                </h1>
                <p style={{ color: 'rgba(245,243,255,0.4)', fontSize: '0.9rem' }}>
                    Service temporarily unavailable / Сервис временно недоступен
                </p>
                <button
                    onClick={reset}
                    className="survey-submit"
                    style={{ maxWidth: 200, marginTop: 8 }}
                >
                    Qayta urinish
                </button>
            </div>
        </div>
    );
}
