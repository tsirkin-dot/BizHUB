window.P_SECTORS = [

/* ============================================================ SECTOR: LANDLORDS */
{
  path: "/sectors/landlords",
  kind: "sector",
  skin: "full",
  title: "Private landlords",
  h1: "Renting out property as a private landlord",
  lede: "Most private landlords own between one and four units, manage them personally, and meet each document the week something goes wrong. **This page takes the same stack from the other side: not what the documents are, but what the year looks like for the person signing them.**",
  job: "Show a private landlord the shape of a letting year and which document each part of it needs, in the sector's own terms.",
  voice: [
    "I've got one rental and no idea what paperwork I'm supposed to keep.",
    "What does a landlord actually have to do every year, not just at the start?",
    "Is it worth using an agent for two properties or should I do it myself?",
    "I inherited a house with a tenant already in it, what do I need?"
  ],
  secs: [
    {
      h: "What a letting year actually looks like",
      b: [
        { a: "A tenancy is not one event with paperwork attached; it is four phases, and each one has documents that only make sense inside it. Advertising and screening, creating the tenancy, running it, and ending it — in that order, every time." },
        { steps: [
          { b: "Before anybody applies", s: "Check the property is lettable, decide the rent and the term, and find out whether your city requires a licence. See [renting out your first property](/use-cases/renting-out-your-first-property)." },
          { b: "Choosing a tenant", s: "One written set of criteria applied to every applicant, with consent for any check. See [the rental application](/agreements/real-estate/rental-application)." },
          { b: "Creating the tenancy", s: "A [lease](/agreements/real-estate/residential-lease-agreement) or a [month-to-month agreement](/agreements/real-estate/month-to-month-rental-agreement), plus the condition record on the day the keys move." },
          { b: "Running it", s: "Rent records, repair records, notice before entry, and the disclosures your state renews rather than gives once." },
          { b: "Changing or ending it", s: "A [renewal](/agreements/real-estate/lease-renewal-agreement), a [termination agreement](/agreements/real-estate/lease-termination-agreement) or a [notice to vacate](/agreements/real-estate/notice-to-vacate), depending on who wants what." }
        ] }
      ]
    },
    {
      h: "What the sector gets wrong about scale",
      b: [
        { a: "A private landlord with three units is not a small property manager. The difference is not volume, it is that nothing is anybody's job: no standard lease, no file that opens itself, no calendar that raises the renewal." },
        "One unit forgives informality because there is only one of everything to remember. Three units is where memory stops working and nothing has yet replaced it, which is why the third tenancy is usually where the first real dispute appears.",
        { note: { k: "info", t: "The threshold worth watching", d: "When you can no longer say from memory which tenancy is on which version of your lease, the stack has outgrown you rather than the other way round. See [the landlord document stack](/for-business/landlords) for what to standardise first." } }
      ]
    },
    {
      h: "Doing it yourself, or handing it to an agent",
      b: [
        { a: "The decision is rarely about cost. It is about which of the two failure modes you would rather carry: your own inconsistency, or somebody else acting inside an authority you wrote badly." },
        { table: { c: ["", "Managing it yourself", "Using an agent"], r: [
          ["What goes wrong", "Documents drift, deadlines are missed, records are thin", "Decisions get made that you did not authorise"],
          ["What fixes it", "One standard set of documents and one place they live", "A management agreement that names the limits precisely"],
          ["Who the tenant's claim lands on", "You", "Usually still you, with the agent behind you"],
          ["Worth it at", "One to three units, if you are organised", "Once the calendar stops fitting in your head"]
        ] } },
        "If you do hand it over, the document that decides everything is the management agreement, not the lease. See [property management](/industries/property-management) and the sector version at [managed portfolios](/sectors/managed-portfolios)."
      ]
    }
  ],
  ask: "I own two rentals in Ohio and want one standard lease plus a proper move-in checklist.",
  mistakes: {
    d: "The errors particular to doing this alone, as opposed to the errors anybody makes with a lease.",
    items: [
      { h: "Running each tenancy from memory", p: "With one unit it works. With three, the renewal date you are sure about is the one you are about to miss, and a missed renewal changes the tenancy on the law's terms rather than yours. See [holdover tenant](/glossary/holdover-tenant)." },
      { h: "Treating the deposit as your money", p: "It is the tenant's money you are holding. Several states require it held separately, and spending it is a problem that only surfaces on the day you have to return it. See [security deposit](/glossary/security-deposit)." },
      { h: "Doing repairs without a paper trail", p: "The repair you did promptly and cannot evidence is, in a dispute, the repair you did not do." },
      { h: "Being a friend and a landlord at once", p: "Informal arrangements with a tenant you like are the ones that end worst, because nothing was written down while everybody was still reasonable." },
      { h: "Learning the law only for the state you live in", p: "The rules that bind you are the ones where the property is, not where you are." }
    ]
  },
  flags: {
    d: "Signals from an applicant or a tenant that a private landlord, with no office behind them, should slow down for.",
    items: [
      { h: "An offer to pay well above asking, in cash, immediately", p: "Speed and cash are usually being exchanged for the absence of a record. See [the rental application](/agreements/real-estate/rental-application)." },
      { h: "A reluctance to have the tenancy in writing at all", p: "Whoever proposes the handshake benefits from there being no agreed version of what was agreed." },
      { h: "Pressure to skip the move-in record", p: "It is the one document that protects the tenant as much as you, so resistance to it is worth understanding rather than accommodating. See [a new tenant moving in](/use-cases/new-tenant-moving-in)." },
      { h: "Requests routed only through a third party you never meet", p: "You are entitled to know who is actually living in the property, and to have every adult named on the agreement." }
    ]
  },
  faq: [
    { q: "Do I need a written lease if the tenant is family?", a: "An oral tenancy is still a tenancy in most states and still has to be ended lawfully. Writing it down does not add obligations, it records the ones you already have — and it is the family arrangements that most often end in a dispute nobody can evidence." },
    { q: "How many properties before I should incorporate or use an agent?", a: "There is no legal threshold, and the honest trigger is operational rather than numerical: when you can no longer answer from memory which tenancy is on which lease version, and which deposit sits where, the arrangement has outgrown informal management." },
    { q: "What do I have to keep, and for how long?", a: "At minimum the signed agreement, the condition record, every rent receipt, every notice served with proof of service, and the disclosures you gave. Retention periods vary by state, but the practical answer is the length of the tenancy plus the limitation period for a claim on it." },
    { q: "Is a lease from the internet good enough?", a: "It is a starting point, not a finished document. What a generic template cannot carry is your state's mandatory disclosures and its rules on deposits, notice and entry — which is exactly the part that decides disputes." }
  ],
  rel: [
    { p: "/for-business/landlords", w: "The same stack organised by document rather than by the year — what each one is and what has to be in it." },
    { p: "/sectors/managed-portfolios", w: "The other side of the decision above: what changes once somebody else manages the property for you." },
    { p: "/use-cases/renting-out-your-first-property", w: "The step-by-step for a first tenancy, from empty property to signed agreement." },
    { p: "/agreements/real-estate", w: "All nine documents, with the question each of them answers." }
  ],
  cta: {
    h: "One set of documents, reused properly.",
    p: "Answer a few questions about the property and the state, and BizDraft drafts the agreement with your numbers and the disclosures that apply where the property is.",
    b1: "Draft a lease",
    b2: "See the document stack", b2p: "/for-business/landlords"
  }
},

/* ============================================================ SECTOR: MANAGED PORTFOLIOS */
{
  path: "/sectors/managed-portfolios",
  kind: "sector",
  skin: "full",
  title: "Managed portfolios",
  h1: "Documents for portfolios somebody else manages",
  lede: "Once an agent stands between the owner and the tenant, every document acquires a second question: not only what it says, but who was entitled to sign it. **This page is the sector view of that problem — what changes about the paperwork when the manager and the owner are different people.**",
  job: "Show what a managed portfolio changes about the tenancy documents, from the owner's side and the agent's side at once.",
  voice: [
    "My agent signed a lease I never saw, is that allowed?",
    "Who actually holds the deposit if a management company collects the rent?",
    "We're taking over 40 units from another agent, what do we need from them?",
    "Can a property manager evict a tenant without asking the owner?"
  ],
  secs: [
    {
      h: "What changes when somebody else manages it",
      b: [
        { a: "Nothing about the tenancy documents changes in substance. What changes is that each one now has an author who is not the owner, and every one of them can be challenged on authority rather than on terms." },
        { cards: [
          { h: "Who signs", p: "The agent as agent for a named owner, or the owner directly. The choice decides who the tenant can pursue and who may serve notice." },
          { h: "Who holds the money", p: "Deposits, first rent and repair floats each need a named holder and, in several states, a separate account." },
          { h: "Who decides", p: "Approving a tenant, agreeing an early exit, settling a deduction — each needs a written limit or it becomes an argument later." }
        ] }
      ]
    },
    {
      h: "The management agreement carries the whole sector",
      b: [
        { a: "In a managed portfolio the management agreement outranks the lease, because it is the document that says whether the lease was validly made at all." },
        { ul: [
          "**The authority granted**, itemised rather than described: let, renew, serve notice, settle deductions, spend on repairs up to a stated figure.",
          "**Whose name goes on the lease**, and in what capacity the agent signs it.",
          "**Where deposits are held**, in whose name, and under which state's scheme.",
          "**What happens on termination**, including who the deposits transfer to and when the files move.",
          "**Who answers a compliance request**, since disclosures and licensing need a named owner rather than an office."
        ] },
        { note: { k: "warn", t: "The clause most often missing", d: "A written repair threshold. Without one, every urgent repair is a judgement the agent has to defend afterwards, and every invoice is a candidate for dispute. See [property management](/industries/property-management)." } }
      ]
    },
    {
      h: "Taking over somebody else's portfolio",
      b: [
        { a: "An incoming agent inherits the tenancies exactly as they are, including whatever is wrong with them, and inherits them whether or not the paperwork arrives with the keys." },
        { steps: [
          { b: "Get the leases before the handover, not after", s: "You are bound by terms you have not read, so read them while you can still price the work." },
          { b: "Reconcile the deposits", s: "Match what the outgoing ledger says is held against what the account actually holds, and record the gap before you accept it." },
          { b: "Check which disclosures were given", s: "The obligation is to have given them and to be able to show it. Missing evidence is the problem you inherit most often." },
          { b: "Date the authority", s: "Your management agreement should say precisely when your authority begins for each unit, because notices served in the gap are the ones that fail." }
        ] }
      ]
    }
  ],
  ask: "Management agreement for 40 units in Arizona, 8% fee, $500 repair limit, agent holds deposits.",
  mistakes: {
    d: "What goes wrong inside a managed portfolio, from whichever side is doing it.",
    items: [
      { h: "Signing in a capacity nobody stated", p: "An agent signing without saying whose agent they are leaves the tenant guessing who their counterparty is, and leaves the question open for a court." },
      { h: "Running on a verbal authority", p: "“The owner is fine with it” is not a spend limit, a letting authority or a settlement power. Each of them belongs in the management agreement." },
      { h: "Letting deposits sit in the operating account", p: "Where the state requires separate holding it is a compliance failure, and where it does not it is still the agent's insolvency risk sitting on the tenant's money." },
      { h: "Ending the management with the deposits unresolved", p: "The tenant's claim survives the handover between agents, and an untraceable deposit is the most common thing that handover loses." },
      { h: "Keeping the owner out of the compliance loop", p: "Licensing and disclosure duties usually attach to the owner. An agent who handles them silently leaves the owner unable to answer for them." }
    ]
  },
  flags: {
    d: "Signals worth acting on — for an owner appointing a manager, and for an agent inheriting a portfolio.",
    items: [
      { h: "A management agreement with no termination clause", p: "An arrangement that cannot be ended cleanly is one that ends expensively, usually at the worst moment for the tenancies inside it." },
      { h: "Deposit totals that do not reconcile at handover", p: "Accept the portfolio and you have accepted the gap. Record it in writing before the transfer completes. See [security deposit](/glossary/security-deposit)." },
      { h: "Leases the outgoing side cannot produce", p: "You are bound by them regardless. Absence of the document is not absence of the obligation." },
      { h: "Nobody named as responsible for compliance", p: "Disclosures, licences and deposit deadlines need an owner. “The office” is not one." }
    ]
  },
  faq: [
    { q: "Can a managing agent sign the lease instead of the owner?", a: "Generally yes, where the management agreement grants that authority and the lease says the agent signs as agent for a named owner. What causes trouble is signing without stating the capacity, which leaves it unclear who the tenant contracted with." },
    { q: "Who is responsible if the agent gets a notice wrong?", a: "The tenant's claim is usually against the landlord, because that is who the tenancy is with. Whether the agent then carries that cost is a question for the management agreement, which is why its indemnity and authority clauses matter more than they look." },
    { q: "Should the agent or the owner hold the deposit?", a: "Either can, in most states, provided the agreement says which and the money is held the way that state requires. What is not workable is leaving it unstated, because the deadline for returning it runs against somebody regardless." },
    { q: "What should an owner ask for at the end of a management agreement?", a: "The full file for every tenancy, the deposit reconciliation with evidence of transfer, the disclosures given with dates, and a written cut-off for the agent's authority. Ask for them before the final fee is paid rather than after." }
  ],
  rel: [
    { p: "/industries/property-management", w: "The document-first version of the same subject: what a managing agent adds to the tenancy stack." },
    { p: "/sectors/landlords", w: "The other side of the arrangement — what the owner carries when nobody manages it for them." },
    { p: "/glossary/security-deposit", w: "The four rules that attach to a deposit, whoever is holding it." },
    { p: "/agreements/real-estate/rental-application", w: "Screening rules apply to whoever runs the screening, agent or owner." }
  ],
  cta: {
    h: "Set the authority before the first tenancy needs it.",
    p: "BizDraft builds the management agreement and the tenancy documents from the same answers, so the authority in one matches the signatures in the other.",
    b1: "Draft a management agreement",
    b2: "See the tenancy stack", b2p: "/for-business/landlords"
  }
}

];
