import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
    const [openPos, setOpenPos] = useState(null);

    const switchAns = (faqPos) => {
        if (openPos === faqPos) {
            setOpenPos(null); 
        } else {
            setOpenPos(faqPos);
        }
    };

    const faqArray = [
        {question: "Does the Museum provide Wifi?", answer: "Yes, the front desk employees will provide you with wifi upon request."},
        {question: "Are there places to sit and relax during my visit?", answer: "Yes, benches are placed in hallways to provide visitors with rest."},
        {question: "Is the museum open on holidays?", answer: "No, we are closed on Thanksgiving and Christmas day."},
        {question: "Can I host an event at the museum?", answer: "Yes, we can reserve an events room for you upon request."},
    ];

    return (
        <div className = "faqContainer">
             <div className="faqTitle">
                    FAQs
            </div>
            <div className="faqBoxContainer">
                <div className="faqContents">
                    {faqArray.map((faq, faqPos) => (
                        <div key={faqPos} className="faqSection">
                            <div
                                className="faqQuestion"
                                onClick={() => switchAns(faqPos)}
                            >
                                <h3>{faq.question}</h3>
                                <span>{openPos === faqPos ? '-' : '+'}</span>
                            </div>
                            {openPos === faqPos && <div className="faqAnswer"><p>{faq.answer}</p></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
