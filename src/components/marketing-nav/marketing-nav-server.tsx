import { MarketingNav } from "@/components/marketing-nav/marketing-nav";
import { getClerkSession } from "@/lib/clerk/session";

/** Nav con sesión en el servidor: los botones de auth van en el HTML del primer paint. */
export async function MarketingNavServer() {
  const { isSignedIn } = await getClerkSession();
  return <MarketingNav isSignedIn={isSignedIn} />;
}
