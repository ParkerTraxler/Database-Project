import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null); 
        } else {
            setActiveIndex(index);
        }
    };

    const faqData = [
        { question: "Does the Museum provide Wifi?", answer: "Yes, the front desk employees will provide you with wifi upon request." },
        { question: "Are there places to sit and relax during my visit?", answer: "Yes, benches are placed in hallways to provide visitors with rest." },
        { question: "Is the museum open on holidays?", answer: "No, we are closed on Thanksgiving and Christmas day." },
        { question: "Can I host an event at the museum?", answer: "Yes, we can reserve an events room for you upon request." },
    ];

    return (
        <div className = "faq-wrapper">
            <div className="faq-container">
                <h1>FAQs</h1>
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <div
                                className="faq-question"
                                onClick={() => toggleAnswer(index)}
                            >
                                <h3>{faq.question}</h3>
                                <span>{activeIndex === index ? '-' : '+'}</span>
                            </div>
                            {activeIndex === index && <div className="faq-answer"><p>{faq.answer}</p></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
