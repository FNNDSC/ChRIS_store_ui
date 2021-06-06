import React, { useState } from "react";
import questions from "./Faq.json";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionToggle,
  Page,
  PageSection
} from "@patternfly/react-core";

const Faq = () => {
  const [expanded, setExpanded] = useState("");

  const onToggle = (id) => {
    if (id === expanded) {
      setExpanded("");
    } else {
      setExpanded(id);
    }
  };

  return (
    <Page>
        <PageSection>
      {questions.map(({ key, question, answer }) => (
        <Accordion asDefinitionList={false} key={key}>
          <AccordionItem>
            <AccordionToggle
              onClick={() => {
                onToggle(`ex-toggle+${key}`);
              }}
              isExpanded={expanded === `ex-toggle+${key}`}
              id={`ex-toggle+${key}`}
            >
              {question}
            </AccordionToggle>
            <AccordionContent
              id="ex-expand1"
              isHidden={expanded !== `ex-toggle+${key}`}
            >
              <p>{answer}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
        </PageSection>
    </Page>
  );
};

export default Faq;
