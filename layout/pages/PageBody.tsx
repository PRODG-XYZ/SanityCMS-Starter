import { PageContext } from "../../context/PageContext";
import { PageType } from "../../queries/page.query";
import { DialogBuilder } from "../modulebuilder/DialogBuilder";
import { HeroBuilder } from "../modulebuilder/HeroBuilder";
import { ModuleBuilder } from "../modulebuilder/ModuleBuilder";
import React, { useContext } from "react";

export const PageBody = (props: PageType) => {
  const { sitemapItem, language } = useContext(PageContext);

  return (
    <>
      {props.hero ? (
        <HeroBuilder hero={props.hero} />
      ) : (
        <h1 className="sr-only">{sitemapItem?.titles?.[language]}</h1>
      )}

      {Boolean(props?.modules?.length) && (
        <ModuleBuilder items={props.modules} />
      )}
      {Boolean(props?.dialogs?.length) && (
        <DialogBuilder items={props.dialogs} />
      )}
    </>
  );
};