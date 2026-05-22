import { CatalogViewAllButton } from "@/components/marketing-nav/catalog-view-all-button";
import { NavLinkList } from "@/components/marketing-nav/nav-link-list";
import { SectionLabel } from "@/components/marketing-nav/section-label";
import { catalogDescriptionShort, catalogSections } from "@/data/nav-data";

export function CatalogMobileSection() {
  return (
    <div className="space-y-4 text-xs text-muted-foreground">
      <p className="leading-relaxed border-l-2 border-foreground pl-3 py-0.5">{catalogDescriptionShort}</p>
      <CatalogViewAllButton />
      <div className="space-y-4 text-foreground pt-2">
        {catalogSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <SectionLabel icon={section.icon}>{section.title}</SectionLabel>
            <NavLinkList items={section.items} className="mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
