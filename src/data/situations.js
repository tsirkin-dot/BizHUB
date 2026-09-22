window.P_SITUATIONS = [

/* ============================================================ FIRST PROPERTY */
{
  path: "/use-cases/renting-out-your-first-property",
  kind: "usecase",
  title: "Renting out your first property",
  h1: "You are renting out a property for the first time",
  lede: "You have a home somebody else is going to live in, and no idea what happens between the advert and the keys. **There are seven steps and two of them are the ones that go wrong** — the screening record, and the condition report.",
  job: "Take a first-time landlord from an empty property to a signed tenancy, in the order the decisions actually arrive.",
  voice: [
    "I inherited my mum's house and I want to rent it out, where do I even start?",
    "I'm moving in with my partner and renting out my old place, what do I need before someone moves in?",
    "Do I need a licence to rent out a room in my house?",
    "What's the very first thing I should do before advertising my apartment?",
    "I've found someone who wants it, how do I check they're not going to be a problem?"
  ],
  secs: [
    {
      h: "The moment this page is for",
      b: [
        { a: "You own or control a property, you have decided to let somebody live in it for rent, and the paperwork is the part you have not done before. The fastest way to get this wrong is to start with a template. Start instead with whether you are allowed to rent the property at all, because that answer can change everything after it." },
        { cards: [
          { h: "What you need to know", p: "Whether the property may lawfully be let, what your state requires you to disclose, and how to screen without breaking fair-housing rules." },
          { h: "What becomes risky if unclear", p: "An unlicensed let can be unenforceable. An undocumented condition means you cannot deduct from the deposit. An inconsistent screening process is a discrimination claim." }
        ] }
      ]
    },
    {
      h: "Before you advertise: is the property lettable?",
      b: [
        { a: "Four things can stop a residential let before it starts, and all four are local. Check them before you spend money on photographs." },
        { ul: [
          "**Registration or licensing.** A growing number of American cities require rental units to be registered, licensed or inspected. In some of them, an unregistered landlord cannot bring an eviction action or, in a few, cannot collect rent for the unregistered period.",
          "**Occupancy and zoning.** Whether the unit is a legal dwelling, how many people may occupy it, and whether an accessory unit or basement conversion is permitted at all.",
          "**Your own agreements.** A mortgage that prohibits letting without consent, a condominium or homeowners association with rental caps or minimum lease terms, or an insurance policy written for owner-occupation and void the moment a tenant moves in.",
          "**Habitability.** Working heat, hot water, plumbing, electrics, locks, smoke and carbon-monoxide alarms. The implied warranty of habitability applies from day one and is not waivable in most states."
        ] },
        { note: { k: "warn", t: "Tell your insurer", d: "A standard homeowner's policy generally does not cover a tenanted property, and discovering that after a fire is the single most expensive mistake on this page. You need a landlord or dwelling policy, and the tenant needs their own renter's insurance for their belongings — which you can require in the lease." } }
      ]
    },
    {
      h: "The seven steps, in order",
      b: [
        { steps: [
          { b: "Set your criteria in writing, before anyone applies", s: "Income threshold, credit expectation, rental history, pets, smoking, occupancy limit. Written first means you are applying a policy rather than reacting to a person, and that is the whole defence to a fair-housing complaint." },
          { b: "Advertise the property, not the tenant you want", s: "Describe the home, the rent, the term and the criteria. Never describe who would suit it. “Perfect for a young professional couple” is a familial-status problem and “quiet Christian building” is a religion problem." },
          { b: "Take applications on one form", s: "The same [rental application](/agreements/real-estate/rental-application) from everyone, including the consent language that lets you verify income and run a screening report." },
          { b: "Screen consistently, and document the decision", s: "Same checks, same order, same thresholds. If a consumer report contributes to declining someone, send the adverse action notice federal law requires." },
          { b: "Choose the document that matches the tenancy", s: "A [fixed-term lease](/agreements/real-estate/residential-lease-agreement) if you both want a settled year, a [month-to-month agreement](/agreements/real-estate/month-to-month-rental-agreement) if you may want the property back." },
          { b: "Attach the disclosures your state requires", s: "Lead-based paint for anything built before 1978, plus whatever your state and city add. These are part of the lease, not optional extras." },
          { b: "Do the move-in inspection before you hand over keys", s: "Room by room, with the tenant present, photographs dated, both signatures on the report. This is step seven and it is the one that pays for itself. See [the move-in day](/use-cases/new-tenant-moving-in)." }
        ] }
      ]
    },
    {
      h: "The money decisions, and where the limits are",
      b: [
        { table: { c: ["Decision", "How to think about it", "Legal limit to check"], r: [
          ["Rent", "Price against what comparable units actually let for, not what is listed. Listed prices include the ones that are not moving.", "Rent stabilisation, where your city has it"],
          ["Security deposit", "Enough to cover a month of damage risk. See [security deposit](/glossary/security-deposit).", "Most states cap it as a multiple of rent; some regulate where it is held"],
          ["Last month's rent", "Taken up front alongside the deposit, in states that permit it", "Several states count it towards the deposit cap"],
          ["Late fee", "A flat sum or a small percentage after a grace period", "Many states cap the amount or require a minimum grace period"],
          ["Pet deposit or pet rent", "Separate from the security deposit, and stated separately", "Assistance animals are not pets and cannot be charged for"],
          ["Application fee", "Cover the actual screening cost, no more", "Capped or prohibited in several states"]
        ] } }
      ]
    },
    {
      h: "What this page cannot tell you",
      b: [
        "It cannot tell you whether your city requires a rental licence, what your state caps the deposit at, or how much notice you must give before entering. Those are the three numbers that vary most across the United States, and they are the three you need before you sign anything.",
        "It also does not cover the tax treatment of rental income, which is a real part of the decision and a separate specialism. Rental income is reportable, most operating expenses are deductible, and depreciation is a significant part of the arithmetic. Talk to an accountant before the first rent arrives, not after the tax year closes."
      ]
    }
  ],
  faq2At: 3,
  faq2H: "Managing it, and changing your mind",
  mistakes: {
    h: "The five mistakes first-time landlords actually make",
    d: "These five account for most of what goes wrong in a first tenancy, and every one of them is a decision the landlord makes rather than something that happens to them.",
    items: [
      {
        h: "No move-in condition report",
        p: "Without it you cannot prove what the property looked like, and a deposit deduction you cannot prove is one you have to return. See [a new tenant moving in](/use-cases/new-tenant-moving-in)."
      },
      {
        h: "Cash rent with no receipts",
        p: "It is the hardest dispute to resolve and it always resolves against the party with no records."
      },
      {
        h: "Letting an unnamed adult move in",
        p: "Somebody who is not on the lease owes you no rent, and in several states is still difficult to remove."
      },
      {
        h: "Describing the ideal tenant in the advert",
        p: "Familial status and religion are the two that catch people who had no discriminatory intent whatsoever. See [the rental application](/agreements/real-estate/rental-application)."
      },
      {
        h: "Entering the property without notice",
        p: "Most states require advance written notice except in an emergency. It is also the fastest way to destroy a working relationship with a good tenant. See [quiet enjoyment](/glossary/quiet-enjoyment)."
      }
    ]
  },
  flags: {
    d: "Signals from an applicant or an incoming tenant worth slowing down for. Each one is about conduct or paperwork, never about who somebody is.",
    items: [
      {
        h: "Pressure to skip the written agreement",
        p: "A tenancy agreed on a handshake is one you have to prove the terms of later, from memory, against somebody with a different memory."
      },
      {
        h: "Cash up front in exchange for no screening",
        p: "Six months offered on the condition that you do not check anything is a payment for the absence of a record."
      },
      {
        h: "The number of occupants keeps changing",
        p: "Ask once and write the answer down. A figure that moves between viewing and signing tends to keep moving after move-in."
      },
      {
        h: "Reluctance to let you document the condition",
        p: "The condition report protects both sides. Resistance to it is specifically resistance to having a baseline."
      }
    ]
  },
  faq: [
    { q: "Do I need a lawyer to rent out my house?", a: "For a straightforward residential let in a state you can research, generally no — the documents are standard and the obligations are published. Get advice when something is unusual: a property with an unpermitted unit, a tenancy in a rent-stabilised city, a co-owner who disagrees, or any dispute that has already started. The cost of an hour of advice is small against a single failed eviction." },
    { q: "Can I rent to a friend without a written agreement?", a: "You can, and it is the most common way a friendship and a property both get damaged. A written lease protects the friendship precisely because it takes the awkward conversations — late rent, leaving early, the state of the kitchen — and settles them in advance, in writing, when nobody is angry." },
    { q: "How much should I ask for the security deposit?", a: "Start from what your state permits, which is commonly one or two months' rent and sometimes uncapped, then take the smaller of that and what your local market actually bears. A deposit noticeably above local norms narrows your applicant pool to people who can find the cash, which is not the same group as people who will look after the property." },
    { q: "Should I use a property manager?", a: "It is a question about your time and your distance from the property rather than about the paperwork. A manager typically charges a percentage of rent plus a letting fee, and takes on advertising, screening, rent collection, repairs and compliance. For one local unit most landlords self-manage; for a unit in another state, or several units, the arithmetic usually favours a manager. See [property management](/industries/property-management)." },
    { q: "What if I want to move back in later?", a: "Then do not sign a twelve-month lease. A fixed term binds you as much as the tenant, and you cannot end it early because your plans changed. A [month-to-month agreement](/agreements/real-estate/month-to-month-rental-agreement) keeps that option open — though note that a growing number of cities require a just cause even for a month-to-month termination, and owner move-in is usually one of the permitted causes." }
  ],
  rel: [
    { p: "/agreements/real-estate/rental-application", w: "The first document you actually hand to anybody, and the consent it has to carry." },
    { p: "/agreements/real-estate/residential-lease-agreement", w: "The document that creates the tenancy, clause by clause." },
    { p: "/use-cases/new-tenant-moving-in", w: "The next step: what happens on the day the keys change hands." },
    { p: "/for-business/landlords", w: "The full stack of documents a landlord keeps, across the whole life of a tenancy." }
  ],
  cta: { h: "Start from your property, not a blank template.", p: "Tell BizDraft where the property is and what you are letting. It picks the documents, applies your state's rules, and fills in what it can from your answers.", b1: "Start a draft", b2: "See the landlord stack", b2p: "/for-business/landlords" }
},

/* ============================================================ MOVE IN */
{
  path: "/use-cases/new-tenant-moving-in",
  kind: "usecase",
  title: "A new tenant moving in",
  h1: "A new tenant is moving in this week",
  lede: "Everything on move-in day either protects you for the next twelve months or does not exist. **The condition report is the document that decides the deposit argument**, and it can only be created once — before anybody carries a sofa through the door.",
  job: "Cover the handover itself: what must be documented, exchanged and signed on the day possession passes.",
  voice: [
    "The tenant moves in on Saturday, what do I need to have ready?",
    "How do I document what the apartment looks like before they move in?",
    "Do I have to give the tenant a copy of everything we signed?",
    "They're asking for the keys but the deposit hasn't cleared yet."
  ],
  secs: [
    {
      h: "What has to happen before the keys change hands",
      b: [
        { a: "Five things, and the order matters: money cleared, documents signed and copied, condition recorded, systems shown and tested, keys logged. Handing over keys before the first four are done means doing them later, which in practice means not doing them." },
        { steps: [
          { b: "Confirm the money has actually arrived", s: "First month's rent and the [security deposit](/glossary/security-deposit) in cleared funds. A personal cheque that has not cleared is not payment, and keys handed over against one are very hard to get back." },
          { b: "Sign, and hand over a complete set", s: "The [lease](/agreements/real-estate/residential-lease-agreement), every attachment, every disclosure, and the condition report. Both parties keep a full copy, not a photograph of the signature page." },
          { b: "Walk the property together and record it", s: "Room by room, with the tenant present, on a written form with dated photographs. Both sign. This is the step this whole page exists for." },
          { b: "Show how the place works", s: "Water shut-off, fuse box, thermostat, boiler, bin day, parking, mail. Test every smoke and carbon-monoxide alarm in front of the tenant and note it on the report." },
          { b: "Log the keys", s: "How many of each key, fob and opener, written on the report and signed. At the end of the tenancy you are entitled to every one of them back, and a count nobody wrote down is a count nobody can prove." }
        ] }
      ]
    },
    {
      h: "How to write a move-in condition report that holds up",
      b: [
        { a: "A condition report is only worth what it can prove eleven months later. That means three things: it is specific rather than general, it is dated by something other than your word, and it is signed by the tenant. A report the tenant never saw is a report the tenant can dispute entirely." },
        { ul: [
          "**Go room by room, surface by surface.** Walls, floor, ceiling, windows, doors, fixtures, appliances. “Kitchen: good” proves nothing. “Kitchen: scuff to lower cabinet door left of sink, 4 inches” proves something.",
          "**Photograph everything, including what is fine.** The photographs of undamaged surfaces are the ones that matter, because they establish the baseline. Take more than feels sensible.",
          "**Make the date provable.** Photographs carry timestamps; keep the originals rather than re-saved copies. Some landlords photograph that day's newspaper or a phone showing the date in the first frame.",
          "**Read the meters together** and write the readings on the report, gas, electricity and water. It settles the first utility bill without a conversation.",
          "**Give the tenant a window to add to it.** Three to seven days to note anything missed, returned in writing. A tenant who has been invited to correct the report and did not has a much weaker basis to dispute it later.",
          "**Both sign and date it**, and both keep a copy."
        ] },
        { note: { k: "good", t: "It protects the tenant as much as the landlord", d: "Tenants sometimes resist the walkthrough as an imposition. It is the opposite: the condition report is the only thing standing between a tenant and being charged for damage that was there when they arrived. A tenant who understands that becomes the most thorough person in the room." } }
      ]
    },
    {
      h: "What the tenant should receive on the day",
      b: [
        { table: { c: ["Item", "Why it matters"], r: [
          ["Fully signed lease and every attachment", "A lease signed by only one side is not evidence of what was agreed."],
          ["Required disclosures", "Lead-based paint for pre-1978 housing, plus whatever your state and city require."],
          ["Signed move-in condition report", "The baseline for every deposit deduction that may follow."],
          ["Receipt for deposit and first rent", "Many states require a written deposit receipt naming where the money is held."],
          ["Keys, fobs and openers, counted", "Recorded on the report and signed for."],
          ["Contact for repairs and emergencies", "A named person, a method, and what counts as an emergency."],
          ["How to pay rent", "Method, account details, due date, grace period, and what a late payment costs."]
        ] } }
      ]
    },
    {
      h: "The first thirty days",
      b: [
        { a: "The tenancy's tone is set in the first month, and two habits set it. Respond to the first repair request quickly, even if the repair itself takes time — acknowledging it the same day is what tells a tenant how the next twelve months will go. And put everything in writing, from the start, including the things you agree to informally." },
        "Give the tenant a repair-reporting method and use it yourself: a dedicated email address is enough. It gives both sides a dated record of what was reported and when, which is the fact that decides almost every later dispute about whether a landlord responded reasonably.",
        { note: { k: "warn", t: "Do not turn up unannounced", d: "Most states require advance written notice before a landlord enters, commonly twenty-four hours, except in a genuine emergency. Checking on a new tenant in their first week feels natural and is one of the most common early breaches of [quiet enjoyment](/glossary/quiet-enjoyment). If you want to see the property, ask, and give notice." } }
      ]
    }
  ],
  mistakes: {
    d: "Handover errors are evidence errors. What is not recorded on the day cannot be proved on the day it matters, which is the day the tenancy ends.",
    items: [
      {
        h: "Photographs with no date and no context",
        p: "A close-up of a mark proves the mark. It does not prove which room, which property or which day. Photograph the room, then the detail."
      },
      {
        h: "A condition report only one party signs",
        p: "An unsigned report is one side's opinion written down. Signed by both, it is the baseline every later deduction is measured against."
      },
      {
        h: "Handing over keys before funds have cleared",
        p: "Once possession has passed, a failed payment is an arrears problem rather than a decision you can still make."
      },
      {
        h: "No record of how many keys were issued",
        p: "Key and fob counts are among the few deductions that are simple to prove, and only if the number was written down at the start."
      },
      {
        h: "Skipping meter readings and utility transfers",
        p: "Readings taken on the day settle who owes which part of the first bill, and they take a minute to record."
      }
    ]
  },
  flags: {
    d: "Signals on handover day that are worth pausing over rather than pushing through.",
    items: [
      {
        h: "Willing to take the keys, unwilling to sign the report",
        p: "The report protects both sides. Reluctance to sign it is specifically reluctance about the baseline."
      },
      {
        h: "An extra adult arrives to move in",
        p: "Somebody not on the lease occupying from day one is the hardest version of that problem to unwind. See [the lease](/agreements/real-estate/residential-lease-agreement)."
      },
      {
        h: "Damage described as pre-existing that is not in the report",
        p: "Raised on the day it is a correction to the record. Raised at move-out it is a dispute. See [normal wear and tear](/glossary/normal-wear-and-tear)."
      },
      {
        h: "An immediate request to change the locks",
        p: "Often reasonable, occasionally not. Either way it should be agreed in writing, with a key provided where the lease requires one."
      }
    ]
  },
  faq: [
    { q: "Can I give the keys before the deposit clears?", a: "You can, and you are then an unsecured creditor of somebody who is already living in your property. If the payment fails, your options are to pursue them for it or to begin ending a tenancy that has just started. Wait for cleared funds, or take payment by a method that clears instantly." },
    { q: "What if the tenant refuses to sign the condition report?", a: "Complete it anyway, note on it that the tenant declined to sign and the date, photograph everything, and send them a copy by a method that records delivery, inviting corrections within a stated period. An unsigned report that was demonstrably sent is far stronger than no report — but a tenant refusing to sign is itself worth a conversation about why." },
    { q: "Do I have to be there when they move in?", a: "You do not, but the walkthrough is much stronger when both parties are present, and in several states the tenant has a right to be present at any inspection used to assess the property's condition. If you cannot attend, complete the report first, send it, and give the tenant a defined window to respond in writing." },
    { q: "The tenant wants to change the locks. Can they?", a: "It depends on the lease and the state. Many leases require the landlord's consent and a copy of the new key, which is reasonable — a landlord who cannot enter in an emergency has a real problem. Some states give tenants an affirmative right to change locks, particularly survivors of domestic violence. Handle it in the lease rather than discovering it afterwards." },
    { q: "How long do I have to return the deposit at the end?", a: "That depends on your state, and the range across the United States runs from roughly fourteen to sixty days from the end of the tenancy, almost always with a required itemised statement of any deductions. The clock usually starts when possession is returned, not when the tenant stops paying. See [getting your security deposit back](/use-cases/getting-your-security-deposit-back)." }
  ],
  rel: [
    { p: "/agreements/real-estate/residential-lease-agreement", w: "The agreement being handed over on the day, and what has to be attached to it." },
    { p: "/glossary/normal-wear-and-tear", w: "The standard the condition report will eventually be read against." },
    { p: "/use-cases/getting-your-security-deposit-back", w: "Twelve months from now: what this report is actually for." },
    { p: "/glossary/quiet-enjoyment", w: "What the tenant now has, and what a landlord may no longer do in their own property." }
  ],
  cta: { h: "Walk in with the paperwork already done.", p: "BizDraft produces the lease, the disclosures your state requires and a room-by-room condition report as one set, ready to sign on the day.", b1: "Prepare a move-in pack", b2: "Read the lease guide", b2p: "/agreements/real-estate/residential-lease-agreement" }
},

/* ============================================================ UNPAID RENT */
{
  path: "/use-cases/tenant-stopped-paying-rent",
  kind: "usecase",
  title: "A tenant has stopped paying rent",
  h1: "Your tenant has stopped paying rent",
  lede: "Rent is late and the messages have stopped. **Everything you are about to do has a statutory sequence**, and the two actions that feel most natural — changing the locks, or letting it slide for another month — are the two that cost the most.",
  job: "Set out the lawful sequence when rent goes unpaid, and name the shortcuts that create liability.",
  voice: [
    "My tenant is two months behind and won't answer my calls.",
    "Can I change the locks if someone stops paying rent?",
    "How long does it take to evict someone who isn't paying?",
    "He says he'll pay next week but he said that last month too.",
    "Can I take the unpaid rent out of the security deposit?"
  ],
  secs: [
    {
      h: "What not to do, before anything else",
      b: [
        { note: { k: "warn", t: "Self-help eviction is unlawful in essentially every state", ul: [
          "Do not change the locks or add a lock.",
          "Do not shut off water, heat, gas or electricity, or let a service lapse.",
          "Do not remove the tenant's belongings, or remove a door or window.",
          "Do not threaten any of the above, in writing or otherwise.",
          "Do not enter the property to pressure the tenant into leaving."
        ] } },
        { a: "In most states these acts carry statutory damages — often a multiple of the monthly rent, sometimes a fixed penalty per day, usually plus the tenant's legal costs. They also hand the tenant a defence in the eviction case you would otherwise have won. A landlord who is owed three months of rent and changes the locks frequently ends up owing the tenant money." },
        "The reason this sits at the top of the page rather than the bottom is that it is the point at which most first-time landlords go wrong, and they go wrong on day one of the problem rather than day sixty."
      ]
    },
    {
      h: "The lawful sequence",
      b: [
        { steps: [
          { b: "Check the lease and the ledger", s: "Confirm what is actually owed, for which periods, against what was received. Check the grace period and whether a late fee applies and is within your state's cap. Half of these situations start with a payment that was made and not recorded." },
          { b: "Make written contact", s: "One clear, unemotional message: the amount, the periods, how to pay, by when. Keep it factual. This is both a genuine attempt to resolve it and the first document in the file." },
          { b: "Serve the statutory notice", s: "A notice to pay or quit, in the exact form and with the exact period your state requires — commonly between three and fourteen days. Several states prescribe the wording; a defective notice restarts the process. See [notice to vacate](/agreements/real-estate/notice-to-vacate)." },
          { b: "Let the cure period run", s: "If the tenant pays in full within it, in most states the tenancy continues and the matter is over. Accepting partial payment can waive the notice in some states — if you take part of it, say in writing what it is applied to and that the notice stands, or do not take it." },
          { b: "File in court", s: "If the period expires unpaid, file the eviction action — unlawful detainer, summary process or forcible entry and detainer depending on the state. The court serves the tenant and sets a hearing." },
          { b: "Hearing and judgment", s: "Bring the lease, the ledger, the notice, proof of service and the correspondence. Contested cases turn on documents far more often than on testimony." },
          { b: "The writ, executed by an officer", s: "If you win and the tenant still does not leave, the court issues a writ and a sheriff or marshal executes it. Only they can. This is the step landlords try to skip, and it is the one that carries the penalties." }
        ] },
        { note: { k: "info", t: "How long it takes", d: "Three to six weeks in the fastest states when the case is uncontested; several months in the slowest, and longer if the tenant defends or the court is backlogged. Assume the longer figure when you decide whether to negotiate." } }
      ]
    },
    {
      h: "Should you negotiate instead?",
      b: [
        { a: "Often, yes. Eviction costs filing fees, service costs, usually a lawyer, and weeks or months of an empty unit — and at the end of it you hold a judgment against somebody who could not pay rent. A tenant who will leave voluntarily on an agreed date is frequently the better financial outcome even when they owe you money." },
        { table: { c: ["Option", "What it involves", "When it fits"], r: [
          ["Payment plan", "Written agreement: the arrears, the catch-up schedule, what happens if it is missed", "A tenant with a temporary problem and a real income"],
          ["Mutual termination", "Agreed move-out date, agreed final sum, mutual release. See [lease termination agreement](/agreements/real-estate/lease-termination-agreement)", "A tenant who cannot afford the unit and knows it"],
          ["Cash for keys", "A payment in exchange for leaving clean, on a fixed date, with keys returned", "When speed and condition are worth more than the arrears"],
          ["Rental assistance", "Referral to a local emergency rental assistance programme; many pay landlords directly", "A tenant with a sudden shortfall in an area where a programme is funded"],
          ["Eviction", "The statutory process above", "No engagement, repeat defaults, or another serious breach alongside"]
        ] } },
        "Put whatever you agree in writing, and make it specific: the sum, the dates, the consequence of missing one. A payment plan that is not written down is a conversation both sides will remember differently."
      ]
    },
    {
      h: "Can you take unpaid rent out of the deposit?",
      b: [
        { a: "Not while the tenancy is running. In most states a security deposit secures the landlord's claims at the end of the tenancy, and applying it to rent mid-tenancy is prohibited or, at best, leaves you unsecured for the rest of the term. A tenant is also generally not entitled to instruct you to use it as the last month's rent." },
        "At the end of the tenancy the position reverses: unpaid rent is one of the standard permitted deductions, alongside damage beyond [normal wear and tear](/glossary/normal-wear-and-tear), and it goes on the itemised statement with everything else. If the arrears exceed the deposit, the balance is pursued separately.",
        "A deposit is rarely the answer to this problem anyway. In most of the United States it is one or two months' rent, and by the time an eviction concludes the arrears usually exceed it."
      ]
    },
    {
      h: "What this page does not cover",
      b: [
        "It does not cover the specific notice period, notice wording or filing procedure in your state, all of which are prescribed and all of which vary. Nor does it cover local eviction moratoria or just-cause ordinances, which exist in a number of cities and can change what is permitted entirely.",
        "It also does not cover the situation where rent is being withheld deliberately because of a habitability problem. Many states permit rent withholding or repair-and-deduct where a landlord has failed to fix a condition after proper notice, and where that is what is happening, the answer is the repair, not the notice. Getting that distinction wrong is how a landlord loses an eviction case they thought was simple."
      ]
    }
  ],
  faq2At: 3,
  faq2H: "After they leave: credit, judgments and recovery",
  mistakes: {
    d: "Every item here is a shortcut, and each one converts a rent problem, which the law is largely willing to help you with, into a liability problem, which it is not.",
    items: [
      {
        h: "Changing the locks",
        p: "Self-help eviction is unlawful in every state. Statutory damages for a lockout routinely exceed the arrears that prompted it."
      },
      {
        h: "Shutting off utilities",
        p: "Treated as constructive eviction almost everywhere, and in several states it carries penalties of its own. See [quiet enjoyment](/glossary/quiet-enjoyment)."
      },
      {
        h: "Removing belongings",
        p: "Most states set a specific procedure for abandoned property, with storage and notice obligations. Disposal outside it creates a claim against you."
      },
      {
        h: "Taking a partial payment without recording what it is for",
        p: "Money accepted with no allocation can waive a notice already served, or be argued to have done. Write down which month it pays."
      },
      {
        h: "Filing before the notice period has run",
        p: "The case is dismissed, the clock restarts, and the arrears grow by the length of the whole period. See [notice to vacate](/agreements/real-estate/notice-to-vacate)."
      }
    ]
  },
  flags: {
    d: "Signals that the arrears are not a temporary cash-flow problem and the file needs to be built properly.",
    items: [
      {
        h: "Contact stops altogether",
        p: "Silence after a run of communication is usually the point at which informal recovery has ended."
      },
      {
        h: "Promises that never arrive in writing",
        p: "A payment plan agreed on the phone and never confirmed by email is a plan neither side can enforce."
      },
      {
        h: "A payment offered on condition the notice is dropped",
        p: "Accepting on those terms can waive the notice. Decide that deliberately if you decide it at all."
      },
      {
        h: "A request to take the arrears out of the deposit",
        p: "Several states restrict this while the tenancy is running, and doing it leaves nothing for damage at the end. See [security deposit](/glossary/security-deposit)."
      }
    ]
  },
  faq: [
    { q: "Can I evict a tenant without going to court?", a: "No. Every American state requires a court process to remove a tenant who does not leave voluntarily, and every state prohibits self-help — locks, utilities, belongings. A landlord who takes possession without a court order is usually liable for statutory damages that exceed the rent they were owed." },
    { q: "The tenant offered part of what they owe. Should I take it?", a: "Take it, but protect your position first. In some states accepting rent after serving a notice waives the notice and you have to start again. Write, before or when you accept it, that the payment is accepted as partial payment towards the stated arrears, is not accepted in satisfaction, and does not waive the notice or reinstate the tenancy. If your state is strict on this point, get advice before accepting anything." },
    { q: "Do I still have to do repairs while they are not paying?", a: "Yes. The obligation to keep the property habitable is not conditional on rent being paid. Withholding repairs because rent is owed gives the tenant a defence in the eviction, may permit them to withhold rent lawfully, and in some states is itself actionable. Keep the two matters entirely separate." },
    { q: "Can I report the tenant to a credit agency?", a: "Only through a proper channel. Furnishing information to a consumer reporting agency carries obligations under the Fair Credit Reporting Act, including accuracy and dispute handling, and most individual landlords do not report directly. The usual route is a money judgment from the eviction or a small-claims action, which becomes a matter of record, or a collection agency that reports." },
    { q: "What if they leave owing money and I do not know where they went?", a: "You can still obtain a judgment for the arrears, and a judgment lasts for years and can usually be renewed. Practically, recovery depends on finding an employer or an account. The forwarding address you requested in the notice, and the details on the [rental application](/agreements/real-estate/rental-application) — employer, references, emergency contact — are what make that possible, which is one more reason to take the application seriously." }
  ],
  rel: [
    { p: "/agreements/real-estate/notice-to-vacate", w: "The formal notice that starts the statutory sequence, and how it has to be served." },
    { p: "/agreements/real-estate/lease-termination-agreement", w: "The negotiated alternative: an agreed date, an agreed sum, a mutual release." },
    { p: "/glossary/joint-and-several-liability", w: "If several tenants signed, who you can pursue for the whole of the arrears." },
    { p: "/agreements/real-estate/rental-application", w: "Where the details that make an absent tenant findable came from in the first place." }
  ],
  cta: { h: "Serve a notice your state will actually accept.", p: "BizDraft applies your state's notice period, wording and service rules, and keeps the dated record the court will want to see.", b1: "Draft a notice", b2: "Consider a mutual termination", b2p: "/agreements/real-estate/lease-termination-agreement" }
},

/* ============================================================ DEPOSIT BACK */
{
  path: "/use-cases/getting-your-security-deposit-back",
  kind: "usecase",
  title: "Getting your security deposit back",
  h1: "Getting your security deposit back",
  lede: "You have moved out and the deposit has not arrived. **Every state sets a deadline and requires an itemised statement**, and a landlord who misses either one often loses the right to deduct anything at all — sometimes with a penalty on top.",
  job: "Give a departing tenant the sequence for recovering a deposit, from move-out preparation to a small-claims filing.",
  voice: [
    "It's been six weeks and my landlord hasn't sent my deposit back.",
    "He's charging me for carpet cleaning, is that allowed?",
    "What counts as normal wear and tear when you move out?",
    "My landlord says the whole deposit is gone but won't say what for.",
    "Do I get my deposit back if I broke the lease early?"
  ],
  secs: [
    {
      h: "What the landlord is required to do",
      b: [
        { a: "In every American state a landlord must return the security deposit within a statutory deadline after the tenancy ends and possession is returned, and where anything is deducted, must provide an itemised written statement of what was withheld and why. The deadline runs from roughly fourteen to sixty days depending on the state." },
        "Two consequences follow from missing it, and both are significant. In many states a landlord who fails to send the itemised statement in time forfeits the right to deduct anything and must return the deposit in full. In a number of states there is an additional penalty — commonly double or triple the amount wrongly withheld, sometimes plus the tenant's legal costs — where the withholding was in bad faith.",
        { note: { k: "info", t: "The clock needs a starting point and an address", d: "The deadline usually runs from the end of the tenancy and the return of possession, not from the date you stopped living there. And a landlord cannot post a cheque to an address they do not have. Give a forwarding address in writing, keep proof, and return every key — in several states the tenancy is not treated as surrendered until the keys are back." } }
      ]
    },
    {
      h: "What can and cannot be deducted",
      b: [
        { a: "A deposit secures the landlord against unpaid rent, damage beyond normal wear and tear, and costs the lease makes the tenant responsible for. It does not cover the ordinary deterioration of a property somebody has lived in, and the line between the two decides almost every dispute." },
        { table: { c: ["Item", "Normally deductible?", "Why"], r: [
          ["Unpaid rent and late fees", "Yes", "Money owed under the lease, subject to any statutory cap on the fees"],
          ["A hole punched in a door", "Yes", "Damage, not deterioration"],
          ["Faded paint after two years", "No", "[Normal wear and tear](/glossary/normal-wear-and-tear)"],
          ["Carpet worn along the hallway", "No", "Expected use over time; carpets have a depreciation life"],
          ["Carpet stained with paint or burns", "Yes, usually depreciated", "Damage — but the deduction should reflect the carpet's remaining life, not a new carpet"],
          ["Routine cleaning to relet", "Often not", "Several states prohibit charging for ordinary cleaning; many permit it only if the lease says so and the property is below move-in condition"],
          ["Rubbish and belongings left behind", "Yes", "Removal cost the landlord actually incurred"],
          ["Unreturned keys and fobs", "Yes", "Replacement cost, and rekeying where the lease provides for it"],
          ["Repainting because the tenant painted a wall", "Yes, if unauthorised", "Depends on whether the lease permitted alterations"]
        ] } },
        "Two limits are worth knowing. A deduction should be for the landlord's actual cost, evidenced by an invoice or a reasonable estimate, not a round number. And for items with a finite life — carpet, paint, appliances — many states require the deduction to be depreciated, so a tenant who damages a seven-year-old carpet pays for its remaining life rather than a new one."
      ]
    },
    {
      h: "What to do before you hand back the keys",
      b: [
        { steps: [
          { b: "Give notice in the form the lease requires", s: "In writing, with the move-out date, and with your forwarding address. Keep proof it was sent." },
          { b: "Ask for a pre-move-out inspection", s: "Several states give the tenant a right to one, with a written list of what the landlord proposes to deduct, so you can fix it first. Even where it is not a right, most landlords will agree, and it turns a dispute into a task list." },
          { b: "Clean, and repair what you actually damaged", s: "Work through the landlord's list where you have one. Fixing a hole yourself costs less than being charged for a contractor's callout." },
          { b: "Photograph everything, dated, before you leave", s: "Every room, empty, from the same angles as the move-in report if you have it. This is the single most useful evidence in a deposit dispute and it takes ten minutes." },
          { b: "Take meter readings and return every key", s: "Readings settle the final utility bill. Keys, fobs and openers all go back, counted, ideally with a receipt." },
          { b: "Confirm the date and address in writing", s: "One message: the tenancy ended on this date, keys returned, deposit to this address. It starts the statutory clock and proves when it started." }
        ] }
      ]
    },
    {
      h: "If the deadline passes or the deductions look wrong",
      b: [
        { steps: [
          { b: "Write once, clearly", s: "State the date the tenancy ended, the deposit paid, your state's deadline, and what you are asking for. Ask for the itemised statement and invoices if you have not had them. Keep it factual and give a date for a reply." },
          { b: "Compare the deductions against the move-in report", s: "This is where the condition report earns its keep. A deduction for something the report already recorded, or for something photographed as clean, generally does not survive." },
          { b: "Send a formal demand letter", s: "The sum, the basis, the statutory provision, and a deadline before you file. Many states require a written demand before a penalty can be claimed, and many disputes settle at this letter." },
          { b: "File in small claims", s: "Deposit disputes are the archetypal small-claims case: filing fees are low, no lawyer is needed, and courts hear them routinely. Bring the lease, both condition reports, the photographs, the correspondence and proof of the deposit." }
        ] },
        { note: { k: "good", t: "Bring the documents, not the story", d: "Deposit cases are decided on the move-in report, the move-out photographs, and whether the landlord met the deadline. A tenant with all three usually wins. A tenant with a persuasive account and no paperwork usually does not." } }
      ]
    },
    {
      h: "Situations that change the answer",
      b: [
        { ul: [
          "**You left before the term ended.** You may owe rent for the remainder, subject to the landlord's duty to mitigate, and that can be set against the deposit. It does not forfeit the deposit or remove the landlord's duty to itemise. See [lease termination agreement](/agreements/real-estate/lease-termination-agreement).",
          "**You shared with roommates.** The landlord returns one sum, usually to one address, and dividing it is between the tenants. That is what the [roommate agreement](/agreements/real-estate/roommate-agreement) should have settled at the start.",
          "**The property was sold during your tenancy.** The deposit obligation generally transfers with the property, and the new owner is usually responsible for returning it. Ask both, in writing, and do not let them point at each other.",
          "**You were a subtenant.** Your deposit is with the tenant you rented from, not the landlord, and it comes back from them on your own arrangement's terms. See [sublease agreement](/agreements/real-estate/sublease-agreement)."
        ] }
      ]
    }
  ],
  mistakes: {
    d: "Deposits are usually lost on the way out rather than at the end. By the time the statement arrives, most of what would have answered it no longer exists.",
    items: [
      {
        h: "Leaving no forwarding address in writing",
        p: "In many states the return clock runs from the address you supplied. No address can mean no deadline, and no deadline to enforce."
      },
      {
        h: "No move-out photographs",
        p: "The move-in record shows how it started. Without a matching set from the last day, any deduction is argued from one side's evidence only."
      },
      {
        h: "Handing back the keys before the final inspection",
        p: "Where the state gives you the right to attend, attending is what turns a disputed charge into a corrected one."
      },
      {
        h: "Treating the deposit as the last month's rent",
        p: "Withholding rent against the deposit usually breaches the lease, and can forfeit protections that would otherwise have applied to the deposit itself."
      },
      {
        h: "Missing the deadline to dispute",
        p: "The statutory windows are short, and they run whether or not you were expecting the statement."
      }
    ]
  },
  flags: {
    d: "Signals in what the landlord sends back that the deductions are not going to be straightforward.",
    items: [
      {
        h: "An itemised statement that is not itemised",
        p: "“Cleaning and repairs — $900” is a total, not an itemisation, and most states require the latter."
      },
      {
        h: "Charges for ordinary ageing",
        p: "Faded paint, worn carpet in a walkway and small fixing holes are generally not chargeable. See [normal wear and tear](/glossary/normal-wear-and-tear)."
      },
      {
        h: "Full replacement cost for a part-worn item",
        p: "A carpet with two years left in it is not a new carpet. Depreciation is usually the difference between a fair deduction and an unfair one."
      },
      {
        h: "Silence past the statutory deadline",
        p: "In several states missing the deadline forfeits the right to deduct at all, and sometimes carries a penalty on top."
      },
      {
        h: "A cleaning fee appearing for the first time at the end",
        p: "A charge with no basis in the lease and no mention at move-in is one worth asking for the source of."
      }
    ]
  },
  faq: [
    { q: "How long does a landlord have to return a security deposit?", a: "It is set by state law and runs from about fourteen to sixty days from the end of the tenancy, with thirty days being the most common figure. Almost every state requires an itemised written statement of any deductions within the same period. Check your own state's number — it is the single most useful fact in any deposit dispute." },
    { q: "Can my landlord charge me for cleaning?", a: "It depends on the state, the lease and the condition. Several states prohibit charging for ordinary cleaning between tenancies; others permit it where the lease provides for it and the property was left below the standard it was received in. A blanket cleaning fee applied regardless of condition is the version most likely to be struck out." },
    { q: "My landlord never sent an itemised statement. What now?", a: "In many states that alone forfeits the right to deduct, and the full deposit becomes returnable regardless of the property's condition. Write and say so, citing the deadline and your state's requirement, and give a date for payment before you file in small claims. This is the strongest position a tenant can be in and it is worth asserting clearly." },
    { q: "Can I use my deposit as the last month's rent?", a: "Generally not, unless the lease expressly says so or the landlord agrees in writing. A deposit is security for the end of the tenancy, and a tenant who unilaterally stops paying the final month is in arrears — which becomes a lawful deduction from the very deposit they were trying to use, and can be reported as unpaid rent." },
    { q: "What if the deductions are more than the deposit?", a: "The landlord may pursue the balance, normally in small claims, and the same evidential rules apply: they must show actual costs for actual damage beyond normal wear and tear, depreciated where the item had a finite life. A claim considerably larger than the deposit is worth scrutinising closely, and an itemisation with no invoices behind it rarely survives." }
  ],
  rel: [
    { p: "/glossary/security-deposit", w: "What a deposit legally is, the limits on its size, and how it must be held." },
    { p: "/glossary/normal-wear-and-tear", w: "The line that decides which deductions are lawful, with worked examples." },
    { p: "/use-cases/new-tenant-moving-in", w: "The move-in report this all turns on, and why it is created before the sofa arrives." },
    { p: "/agreements/real-estate/notice-to-vacate", w: "The notice that carries your forwarding address and starts the statutory clock." }
  ],
  cta: { h: "Ask for it in writing, with the statute cited.", p: "BizDraft writes the demand letter with your state's deadline and remedy in it, from your dates and your numbers.", b1: "Draft a deposit demand", b2: "Check what counts as wear and tear", b2p: "/glossary/normal-wear-and-tear" }
}

];
