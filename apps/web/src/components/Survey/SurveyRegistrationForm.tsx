'use client';

import { useState, FormEvent } from 'react';
import { submitRegistration } from '@/lib/api';

interface Props {
    surveyId: number;
    locale: string;
}

type Locale = 'uz' | 'en' | 'ru';

const labels: Record<Locale, Record<string, string>> = {
    uz: {
        first_name: 'Ism',
        last_name: 'Familiya',
        age: 'Yosh',
        email: 'Email (Gmail)',
        telegram: 'Telegram (ixtiyoriy)',
        school: 'Maktab',
        grade: 'Sinf',
        submit: 'Yuborish',
        submitting: 'Yuborilmoqda...',
        success_title: "Rahmat! 🎉",
        success_text: "Sizning javobingiz qabul qilindi.",
        error_email: "Faqat @gmail.com email manzili qabul qilinadi",
        required: "Majburiy maydon",
    },
    en: {
        first_name: 'First Name',
        last_name: 'Last Name',
        age: 'Age',
        email: 'Email (Gmail)',
        telegram: 'Telegram (optional)',
        school: 'School',
        grade: 'Grade',
        submit: 'Submit',
        submitting: 'Submitting...',
        success_title: "Thank you! 🎉",
        success_text: "Your response has been recorded.",
        error_email: "Only @gmail.com email addresses are accepted",
        required: "Required field",
    },
    ru: {
        first_name: 'Имя',
        last_name: 'Фамилия',
        age: 'Возраст',
        email: 'Email (Gmail)',
        telegram: 'Telegram (необязательно)',
        school: 'Школа',
        grade: 'Класс',
        submit: 'Отправить',
        submitting: 'Отправка...',
        success_title: "Спасибо! 🎉",
        success_text: "Ваш ответ принят.",
        error_email: "Принимаются только адреса @gmail.com",
        required: "Обязательное поле",
    },
};

const emptyForm = {
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    telegram: '',
    school: '',
    grade: '',
};

export default function SurveyRegistrationForm({ surveyId, locale }: Props) {
    const lang = (['uz', 'en', 'ru'].includes(locale) ? locale : 'uz') as Locale;
    const t = labels[lang];

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState('');

    const set = (key: string, val: string) => {
        setForm((p) => ({ ...p, [key]: val }));
        setErrors((p) => ({ ...p, [key]: '' }));
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.first_name.trim()) errs.first_name = t.required;
        if (!form.last_name.trim()) errs.last_name = t.required;
        if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 5 || Number(form.age) > 99) errs.age = t.required;
        if (!form.email.trim()) errs.email = t.required;
        else if (!form.email.toLowerCase().endsWith('@gmail.com')) errs.email = t.error_email;
        if (!form.school.trim()) errs.school = t.required;
        if (!form.grade.trim()) errs.grade = t.required;
        return errs;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        setServerError('');
        try {
            await submitRegistration(surveyId, {
                first_name: form.first_name.trim(),
                last_name: form.last_name.trim(),
                age: Number(form.age),
                email: form.email.trim(),
                telegram: form.telegram.trim() || undefined,
                school: form.school.trim(),
                grade: form.grade.trim(),
            });
            setSuccess(true);
        } catch (err: unknown) {
            setServerError(err instanceof Error ? err.message : 'Error');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="success-card">
                <div className="success-icon">✓</div>
                <h3 className="success-title">{t.success_title}</h3>
                <p className="success-text">{t.success_text}</p>
            </div>
        );
    }

    return (
        <form className="survey-form" onSubmit={handleSubmit} noValidate>
            <div className="survey-form__row">
                <Field label={t.first_name} error={errors.first_name}>
                    <input
                        type="text"
                        value={form.first_name}
                        onChange={(e) => set('first_name', e.target.value)}
                        className={`survey-input${errors.first_name ? ' error' : ''}`}
                        autoComplete="given-name"
                    />
                </Field>
                <Field label={t.last_name} error={errors.last_name}>
                    <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) => set('last_name', e.target.value)}
                        className={`survey-input${errors.last_name ? ' error' : ''}`}
                        autoComplete="family-name"
                    />
                </Field>
            </div>

            <div className="survey-form__row">
                <Field label={t.age} error={errors.age}>
                    <input
                        type="number"
                        min={5}
                        max={99}
                        value={form.age}
                        onChange={(e) => set('age', e.target.value)}
                        className={`survey-input${errors.age ? ' error' : ''}`}
                    />
                </Field>
                <Field label={t.email} error={errors.email}>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        className={`survey-input${errors.email ? ' error' : ''}`}
                        placeholder="example@gmail.com"
                        autoComplete="email"
                    />
                </Field>
            </div>

            <div className="survey-form__row">
                <Field label={t.school} error={errors.school}>
                    <input
                        type="text"
                        value={form.school}
                        onChange={(e) => set('school', e.target.value)}
                        className={`survey-input${errors.school ? ' error' : ''}`}
                    />
                </Field>
                <Field label={t.grade} error={errors.grade}>
                    <input
                        type="text"
                        value={form.grade}
                        onChange={(e) => set('grade', e.target.value)}
                        className={`survey-input${errors.grade ? ' error' : ''}`}
                        placeholder="9A, 11B..."
                    />
                </Field>
            </div>

            <Field label={t.telegram} error={errors.telegram}>
                <input
                    type="text"
                    value={form.telegram}
                    onChange={(e) => set('telegram', e.target.value)}
                    className="survey-input"
                    placeholder="@username"
                />
            </Field>

            {serverError && <p className="survey-server-error">{serverError}</p>}

            <button type="submit" className="survey-submit" disabled={submitting}>
                {submitting ? t.submitting : t.submit}
                {!submitting && <span className="survey-submit__arrow">→</span>}
            </button>
        </form>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="survey-field">
            <label className="survey-label">{label}</label>
            {children}
            {error && <span className="survey-error">{error}</span>}
        </div>
    );
}
