"use client";
import { useState } from "react";
import {
  MdFavorite, MdDirectionsCar, MdTrendingUp, MdVerified, MdInbox,
  MdOutlineSpeed, MdMoreVert, MdSearch,
} from "react-icons/md";
import {
  // Layout
  Container, Grid, Flex, Stack, Section, Card, CardHeader, CardBody, CardFooter,
  Divider, Spacer, PageHeader,
  // Typography
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Body, Small, Caption,
  // Buttons
  Button, ButtonLink, IconButton, ButtonGroup, CtaButton, ShareButton, CopyButton,
  DeleteButton, AddButton, LoadMoreButton, BackButton,
  // Inputs
  InputText, InputNumber, InputEmail, InputPassword, InputPhone, Textarea, Select,
  Checkbox, RadioGroup, ToggleSwitch, Slider, SearchBar, FormGroup, Fieldset,
  // Badges
  Badge, StatusBadge, PriceBadge, RatingStars, TagList, ProgressBar, Spinner, Separator,
  // Navigation
  NavLink, Breadcrumb, Pagination, Tabs, Accordion, Stepper, DropdownMenu,
  // Tables
  Table, TableHead, TableRow, TableCell, DataTable, RowActions, EmptyState,
  // Feedback
  AlertBanner, InlineAlert, StepProgress,
  // Modals
  Modal, ConfirmDialog, Tooltip, Popover, LoadingOverlay, OffCanvas,
  // Cards
  StatsCard, FeatureCard, ReviewCard, MessageCard, SubscriptionCard, AnalyticsCard,
  DealerCard, LeadCard,
  // Filters
  FilterGroup, CheckboxGroup, ActiveFilterChips, PriceSlider,
  // Messaging
  ChatBubble,
  // Finance
  FinanceOfferBadge,
  // Admin
  PaymentStatusBadge,
  // Shared
  Avatar, Icon, Skeleton, VisuallyHidden,
} from "@/components/ui";
import { Spec, Group, Row, Col, Label } from "./kit";

const selectOptions = [
  { value: "toyota", label: "Toyota" },
  { value: "bmw", label: "BMW" },
  { value: "vw", label: "Volkswagen" },
];

export function Gallery() {
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [radio, setRadio] = useState("personal");
  const [checks, setChecks] = useState<string[]>(["suv"]);
  const [page, setPage] = useState(3);
  const [filters, setFilters] = useState<Record<string, string>>({
    Make: "Toyota",
    Fuel: "Petrol",
  });

  return (
    <div className="flex flex-col gap-10">
      {/* ─────────────── Buttons ─────────────── */}
      <Group id="buttons" title="Buttons" count={12}>
        <Spec name="Button · variants" note="rounded-xs">
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="danger">Danger</Button>
          </Row>
          <div className="mt-2 rounded-xl bg-dark p-2.5">
            <Row>
              <Button variant="inverse">Inverse</Button>
              <span className="text-2xs text-white/60">for dark surfaces</span>
            </Row>
          </div>
        </Spec>

        <Spec name="Button · sizes" note="28 / 32 / 36 / 40 / 44px">
          <Row>
            <Button size="xs">XS</Button>
            <Button size="sm">SM</Button>
            <Button size="md">MD</Button>
            <Button size="lg">LG</Button>
            <Button size="xl">XL</Button>
          </Row>
        </Spec>

        <Spec name="Button · states">
          <Row>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button leadingIcon={<MdFavorite className="size-3.5" />}>Icon</Button>
            <Button fullWidth variant="outline">Full width</Button>
          </Row>
        </Spec>

        <Spec name="ButtonLink" note="renders next/link">
          <Row>
            <ButtonLink href="#buttons">Primary link</ButtonLink>
            <ButtonLink href="#buttons" variant="outline" size="sm">Outline</ButtonLink>
          </Row>
        </Spec>

        <Spec name="IconButton" note="label prop is required">
          <Row>
            <IconButton label="Favourite" variant="primary"><MdFavorite className="size-4" /></IconButton>
            <IconButton label="Favourite" variant="outline"><MdFavorite className="size-4" /></IconButton>
            <IconButton label="Favourite" variant="ghost"><MdFavorite className="size-4" /></IconButton>
            <IconButton label="Favourite" variant="subtle" round><MdFavorite className="size-4" /></IconButton>
          </Row>
        </Spec>

        <Spec name="ButtonGroup">
          <Col>
            <ButtonGroup>
              <Button size="sm" variant="outline">Day</Button>
              <Button size="sm" variant="outline">Week</Button>
              <Button size="sm" variant="outline">Month</Button>
            </ButtonGroup>
            <ButtonGroup attached>
              <Button size="sm" variant="outline">Left</Button>
              <Button size="sm" variant="outline">Mid</Button>
              <Button size="sm" variant="outline">Right</Button>
            </ButtonGroup>
          </Col>
        </Spec>

        <Spec name="Convenience buttons">
          <Row>
            <AddButton onClick={() => {}} />
            <DeleteButton onClick={() => {}} />
            <BackButton />
            <LoadMoreButton onClick={() => {}} />
            <ShareButton title="Khazu" />
            <CopyButton text="https://khazu.co" />
          </Row>
        </Spec>

        <Spec name="CtaButton" note="full-width hero CTA">
          <CtaButton>Sell my car</CtaButton>
        </Spec>
      </Group>

      {/* ─────────────── Typography ─────────────── */}
      <Group id="typography" title="Typography" count={9}>
        <Spec name="Headings">
          <Col className="gap-1">
            <Heading1>Heading 1</Heading1>
            <Heading2>Heading 2</Heading2>
            <Heading3>Heading 3</Heading3>
            <Heading4>Heading 4</Heading4>
            <Heading5>Heading 5</Heading5>
            <Heading6>Heading 6</Heading6>
          </Col>
        </Spec>

        <Spec name="Body / Small / Caption">
          <Col className="gap-1.5">
            <Body>Body — the default paragraph size.</Body>
            <Body muted>Body muted — secondary copy.</Body>
            <Body weight="semibold">Body semibold.</Body>
            <Small>Small — dense metadata.</Small>
            <Caption>Caption label</Caption>
          </Col>
        </Spec>
      </Group>

      {/* ─────────────── Inputs ─────────────── */}
      <Group id="inputs" title="Inputs" count={20}>
        <Spec name="Text inputs">
          <Col>
            <InputText label="Full name" placeholder="Sipho Dlamini" />
            <InputText label="With icon" placeholder="Search" icon={<MdSearch className="size-4" />} />
            <InputText label="With error" defaultValue="abc" error="That name is too short." />
            <InputText label="Disabled" placeholder="Unavailable" disabled />
          </Col>
        </Spec>

        <Spec name="Typed inputs">
          <Col>
            <InputEmail label="Email" placeholder="you@khazu.co" />
            <InputPassword label="Password" placeholder="••••••••" />
            <InputPhone label="Phone" placeholder="7612 3456" />
            <InputNumber label="Mileage" placeholder="45000" />
          </Col>
        </Spec>

        <Spec name="Sizes" note="sm / md / lg">
          <Col>
            <InputText size="sm" placeholder="Small" />
            <InputText size="md" placeholder="Medium" />
            <InputText size="lg" placeholder="Large" />
          </Col>
        </Spec>

        <Spec name="Select">
          <Col>
            <Select label="Make" options={selectOptions} placeholder="Choose a make" defaultValue="" />
            <Select label="With error" options={selectOptions} error="Pick a make." />
          </Col>
        </Spec>

        <Spec name="Textarea">
          <Textarea label="Description" placeholder="Tell buyers about the car…" hint="Up to 500 characters." />
        </Spec>

        <Spec name="Checkbox / Radio / Toggle">
          <Col>
            <Checkbox label="I accept the terms" defaultChecked />
            <Checkbox label="With error" error="You must accept to continue." />
            <RadioGroup
              name="ds-seller"
              label="Seller type"
              direction="row"
              value={radio}
              onChange={setRadio}
              options={[
                { value: "personal", label: "Personal" },
                { value: "dealer", label: "Dealership" },
              ]}
            />
            <ToggleSwitch
              label="Negotiable price"
              description="Buyers can send offers"
              checked={toggle}
              onChange={(e) => setToggle(e.target.checked)}
            />
          </Col>
        </Spec>

        <Spec name="Slider">
          <Slider label="Max price" min={0} max={500000} step={5000} defaultValue={150000}
            formatValue={(n) => `SZL ${n.toLocaleString()}`} />
        </Spec>

        <Spec name="SearchBar">
          <SearchBar placeholder="Search listings…" />
        </Spec>

        <Spec name="FormGroup / Fieldset">
          <Fieldset legend="Contact">
            <FormGroup direction="horizontal">
              <InputText label="First name" placeholder="Sipho" />
              <InputText label="Last name" placeholder="Dlamini" />
            </FormGroup>
          </Fieldset>
        </Spec>
      </Group>

      {/* ─────────────── Badges ─────────────── */}
      <Group id="badges" title="Badges & indicators" count={8}>
        <Spec name="Badge · variants">
          <Row>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success" dot>With dot</Badge>
          </Row>
        </Spec>

        <Spec name="StatusBadge">
          <Row>
            <StatusBadge status="active" />
            <StatusBadge status="pending" />
            <StatusBadge status="sold" />
            <StatusBadge status="expired" />
            <StatusBadge status="flagged" />
            <StatusBadge status="draft" />
          </Row>
        </Spec>

        <Spec name="PriceBadge / FinanceOfferBadge / PaymentStatusBadge">
          <Row>
            <PriceBadge originalPrice={200000} currentPrice={165000} />
            <FinanceOfferBadge monthlyPayment={3200} />
            <PaymentStatusBadge status="paid" />
            <PaymentStatusBadge status="pending" />
          </Row>
        </Spec>

        <Spec name="RatingStars">
          <Col className="gap-1.5">
            <RatingStars rating={4.5} showValue />
            <RatingStars rating={3} size="sm" />
            <RatingStars rating={5} size="lg" />
          </Col>
        </Spec>

        <Spec name="TagList">
          <TagList tags={["Petrol", "Automatic", "SUV", "Leather", "Sunroof"]} max={3} />
        </Spec>

        <Spec name="ProgressBar">
          <Col>
            <ProgressBar value={72} label="Profile complete" showValue />
            <ProgressBar value={40} tone="warning" />
            <ProgressBar value={95} tone="success" size="sm" />
          </Col>
        </Spec>

        <Spec name="Spinner / Separator">
          <Row>
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Separator variant="dot" />
            <Separator variant="dash" />
          </Row>
        </Spec>
      </Group>

      {/* ─────────────── Layout ─────────────── */}
      <Group id="layout" title="Layout" count={12}>
        <Spec name="Card">
          <Col>
            <Card>
              <CardHeader><Heading5>Card header</Heading5></CardHeader>
              <CardBody><Body muted size="sm">Body content sits here.</Body></CardBody>
              <CardFooter><Button size="sm">Action</Button></CardFooter>
            </Card>
            <Card elevated hover padding="sm">
              <Small>Elevated + hover</Small>
            </Card>
          </Col>
        </Spec>

        <Spec name="Grid" note="responsive by default">
          <Grid cols={3} gap="sm">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-lg bg-surface-sunken p-2 text-center text-2xs">{n}</div>
            ))}
          </Grid>
        </Spec>

        <Spec name="Flex / Stack">
          <Col>
            <Flex gap="sm" items="center" justify="between">
              <Small>Left</Small><Small>Right</Small>
            </Flex>
            <Divider />
            <Stack spacing="sm">
              <div className="rounded-lg bg-surface-sunken p-1.5 text-2xs">Stacked A</div>
              <div className="rounded-lg bg-surface-sunken p-1.5 text-2xs">Stacked B</div>
            </Stack>
          </Col>
        </Spec>

        <Spec name="Divider">
          <Col>
            <Divider />
            <Divider label="or" />
            <Divider color="medium" />
          </Col>
        </Spec>

        <Spec name="PageHeader">
          <PageHeader
            title="My listings"
            subtitle="Manage everything you have for sale"
            actions={<Button size="sm">New listing</Button>}
          />
        </Spec>

        <Spec name="Section / Container / Spacer">
          <Section bg="muted" padding="sm" className="rounded-xl">
            <Container maxWidth="full"><Small>Section · muted · sm padding</Small></Container>
          </Section>
          <Spacer size="sm" />
          <Section bg="dark" padding="sm" className="rounded-xl">
            <Container maxWidth="full"><Small className="text-white">Section · dark</Small></Container>
          </Section>
        </Spec>
      </Group>

      {/* ─────────────── Navigation ─────────────── */}
      <Group id="navigation" title="Navigation" count={14}>
        <Spec name="Tabs · underline">
          <Tabs tabs={[
            { id: "a", label: "Overview", content: <Small muted>Overview panel</Small> },
            { id: "b", label: "Specs", content: <Small muted>Specs panel</Small> },
            { id: "c", label: "History", content: <Small muted>History panel</Small> },
          ]} />
        </Spec>

        <Spec name="Tabs · pills">
          <Tabs variant="pills" tabs={[
            { id: "a", label: "Recent" },
            { id: "b", label: "Top rated" },
            { id: "c", label: "Trending" },
          ]} />
        </Spec>

        <Spec name="Breadcrumb">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Listings", href: "/listings" },
            { label: "Toyota Hilux" },
          ]} />
        </Spec>

        <Spec name="Pagination">
          <Pagination currentPage={page} totalPages={12} onPageChange={setPage} />
        </Spec>

        <Spec name="Accordion">
          <Accordion items={[
            { id: "1", title: "How do I list a car?", content: "Start at /sell and follow the five steps." },
            { id: "2", title: "Is listing free?", content: "Yes — listing is free. Boosts are optional." },
          ]} defaultOpen={["1"]} />
        </Spec>

        <Spec name="NavLink">
          <Row>
            <NavLink href="#navigation" active>Active</NavLink>
            <NavLink href="#navigation">Inactive</NavLink>
          </Row>
        </Spec>

        <Spec name="Stepper">
          <Stepper currentStep="2" steps={[
            { id: "1", label: "Details" },
            { id: "2", label: "Photos" },
            { id: "3", label: "Review" },
          ]} />
        </Spec>

        <Spec name="DropdownMenu">
          <DropdownMenu
            trigger={<Button size="sm" variant="outline" trailingIcon={<MdMoreVert className="size-3.5" />}>Actions</Button>}
            items={[
              { label: "Edit", onClick: () => {} },
              { label: "Duplicate", onClick: () => {} },
              { label: "Delete", onClick: () => {} },
            ]}
          />
        </Spec>
      </Group>

      {/* ─────────────── Feedback ─────────────── */}
      <Group id="feedback" title="Feedback" count={7}>
        <Spec name="AlertBanner">
          <Col>
            <AlertBanner variant="info" title="Heads up">Your listing expires in 3 days.</AlertBanner>
            <AlertBanner variant="success">Listing published.</AlertBanner>
            <AlertBanner variant="warning">Add photos to rank higher.</AlertBanner>
            <AlertBanner variant="danger" onDismiss={() => {}}>Payment failed.</AlertBanner>
          </Col>
        </Spec>

        <Spec name="InlineAlert">
          <Col className="gap-1.5">
            <InlineAlert variant="info">Prices include VAT.</InlineAlert>
            <InlineAlert variant="success">Saved.</InlineAlert>
            <InlineAlert variant="warning">Low resolution image.</InlineAlert>
            <InlineAlert variant="danger">This field is required.</InlineAlert>
          </Col>
        </Spec>

        <Spec name="StepProgress">
          <StepProgress currentIndex={1} steps={[
            { id: "1", label: "Details" },
            { id: "2", label: "Photos" },
            { id: "3", label: "Review" },
          ]} />
        </Spec>

        <Spec name="EmptyState">
          <EmptyState
            icon={<MdInbox className="size-5" />}
            title="No listings yet"
            description="Cars you post will appear here."
            action={<Button size="sm">Create listing</Button>}
          />
        </Spec>

        <Spec name="Skeleton">
          <Col>
            <Row><Skeleton variant="circle" /><Skeleton variant="line" className="w-32" /></Row>
            <Skeleton variant="block" />
          </Col>
        </Spec>
      </Group>

      {/* ─────────────── Overlays ─────────────── */}
      <Group id="overlays" title="Overlays" count={10}>
        <Spec name="Modal">
          <Button size="sm" onClick={() => setModal(true)}>Open modal</Button>
          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            title="Boost this listing"
            description="Feature it at the top for 14 days."
            footer={<>
              <Button size="sm" variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
              <Button size="sm" onClick={() => setModal(false)}>Pay SZL 25</Button>
            </>}
          >
            <Body size="sm" muted>Boosted listings get roughly 3× more views.</Body>
          </Modal>
        </Spec>

        <Spec name="ConfirmDialog">
          <Button size="sm" variant="danger" onClick={() => setConfirm(true)}>Delete…</Button>
          <ConfirmDialog
            isOpen={confirm}
            onClose={() => setConfirm(false)}
            onConfirm={() => setConfirm(false)}
            title="Delete listing?"
            message="This cannot be undone."
            confirmLabel="Delete"
            variant="danger"
          />
        </Spec>

        <Spec name="OffCanvas">
          <Button size="sm" variant="outline" onClick={() => setDrawer(true)}>Open drawer</Button>
          <OffCanvas isOpen={drawer} onClose={() => setDrawer(false)}>
            <Col>
              <Heading5>Filters</Heading5>
              <Select options={selectOptions} label="Make" />
              <Button size="sm" onClick={() => setDrawer(false)}>Apply</Button>
            </Col>
          </OffCanvas>
        </Spec>

        <Spec name="Tooltip">
          <Row>
            <Tooltip content="Verified dealer"><Badge variant="success" dot>Verified</Badge></Tooltip>
            <Tooltip content="Below market" position="bottom"><Badge variant="info">Good price</Badge></Tooltip>
          </Row>
        </Spec>

        <Spec name="Popover">
          <Popover trigger={<Button size="sm" variant="outline">Open popover</Button>}>
            <Small muted>Anything can go in here.</Small>
          </Popover>
        </Spec>

        <Spec name="LoadingOverlay" note="scoped to a container">
          <div className="relative h-20 overflow-hidden rounded-xl bg-surface-sunken">
            <LoadingOverlay isLoading contained message="Loading listings…" />
          </div>
        </Spec>
      </Group>

      {/* ─────────────── Tables ─────────────── */}
      <Group id="tables" title="Tables" count={8}>
        <Spec name="Table" className="p-0">
          <Table caption="Recent listings">
            <TableHead>
              <TableRow>
                <TableCell as="th">Car</TableCell>
                <TableCell as="th">Status</TableCell>
                <TableCell as="th" align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {[
                { car: "Toyota Hilux", status: "active" as const, price: "SZL 320,000" },
                { car: "VW Polo", status: "pending" as const, price: "SZL 145,000" },
                { car: "BMW 320i", status: "sold" as const, price: "SZL 280,000" },
              ].map((r) => (
                <TableRow key={r.car} hover>
                  <TableCell>{r.car}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell align="right">{r.price}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </Spec>

        <Spec name="DataTable" className="p-0">
          <DataTable
            data={[
              { id: 1, name: "Sipho D.", car: "Hilux" },
              { id: 2, name: "Thandi M.", car: "Polo" },
            ]}
            columns={[
              { key: "name", label: "Lead" },
              { key: "car", label: "Car" },
            ]}
          />
        </Spec>

        <Spec name="RowActions">
          <RowActions onView={() => {}} onEdit={() => {}} onDelete={() => {}} />
        </Spec>
      </Group>

      {/* ─────────────── Filters ─────────────── */}
      <Group id="filters" title="Filters" count={5}>
        <Spec name="FilterGroup">
          <FilterGroup label="Body type" defaultOpen>
            <CheckboxGroup
              values={checks}
              onChange={setChecks}
              options={[
                { value: "suv", label: "SUV" },
                { value: "sedan", label: "Sedan" },
                { value: "bakkie", label: "Bakkie" },
              ]}
            />
          </FilterGroup>
        </Spec>

        <Spec name="ActiveFilterChips">
          <ActiveFilterChips
            filters={filters}
            onRemove={(k) => setFilters((f) => { const n = { ...f }; delete n[k]; return n; })}
            onClearAll={() => setFilters({})}
          />
        </Spec>

        <Spec name="PriceSlider">
          <PriceSlider min={0} max={500000} step={10000} />
        </Spec>
      </Group>

      {/* ─────────────── Cards ─────────────── */}
      <Group id="cards" title="Domain cards" count={13}>
        <Spec name="StatsCard">
          <Col>
            <StatsCard icon={<MdDirectionsCar className="size-4" />} value="128" label="Active listings" trend="+12%" />
            <StatsCard icon={<MdTrendingUp className="size-4" />} value="3.4k" label="Views this week" />
          </Col>
        </Spec>

        <Spec name="AnalyticsCard">
          <AnalyticsCard title="Enquiries" value={42} change={8} />
        </Spec>

        <Spec name="FeatureCard">
          <FeatureCard
            icon={<MdVerified className="size-5" />}
            title="Verified dealers"
            description="Every dealership is checked before listing."
          />
        </Spec>

        <Spec name="ReviewCard">
          <ReviewCard author="Thandi M." rating={5} date="2 weeks ago"
            comment="Smooth process from enquiry to handover." />
        </Spec>

        <Spec name="MessageCard">
          <Col>
            <MessageCard sender="Sipho D." preview="Is the Hilux still available?" timestamp="2h" unread onClick={() => {}} />
            <MessageCard sender="Lindiwe N." preview="Can I view it on Saturday?" timestamp="1d" onClick={() => {}} />
          </Col>
        </Spec>

        <Spec name="LeadCard">
          <LeadCard name="Sipho Dlamini" car="Toyota Hilux 2019" status="new"
            message="Still available? I can view today." phone="+268 7612 3456" onContact={() => {}} />
        </Spec>

        <Spec name="DealerCard">
          <DealerCard name="Mbabane Motors" rating={4.6} totalCars={38}
            location="Mbabane" isVerified onViewInventory={() => {}} />
        </Spec>

        <Spec name="SubscriptionCard">
          <SubscriptionCard name="Dealer Pro" price="SZL 450/mo" isPopular
            features={["Unlimited listings", "Featured placement", "Lead analytics"]}
            onSelect={() => {}} />
        </Spec>
      </Group>

      {/* ─────────────── Misc ─────────────── */}
      <Group id="misc" title="Messaging & shared" count={12}>
        <Spec name="ChatBubble">
          <Col>
            <ChatBubble variant="received" timestamp="10:02">Is the Hilux still available?</ChatBubble>
            <ChatBubble variant="sent" timestamp="10:04">Yes — free to view this afternoon.</ChatBubble>
          </Col>
        </Spec>

        <Spec name="Avatar">
          <Row>
            <Avatar initials="SD" size="xs" />
            <Avatar initials="SD" size="sm" />
            <Avatar initials="SD" size="md" />
            <Avatar initials="SD" size="lg" />
            <Avatar initials="SD" size="xl" />
          </Row>
        </Spec>

        <Spec name="Icon">
          <Row>
            <Icon size="xs"><MdOutlineSpeed /></Icon>
            <Icon size="sm"><MdOutlineSpeed /></Icon>
            <Icon size="md"><MdOutlineSpeed /></Icon>
            <Icon size="lg"><MdOutlineSpeed /></Icon>
            <Icon size="xl"><MdOutlineSpeed /></Icon>
          </Row>
        </Spec>

        <Spec name="VisuallyHidden" note="screen-reader only">
          <Small muted>
            There is hidden text here
            <VisuallyHidden>only screen readers announce this</VisuallyHidden>.
          </Small>
        </Spec>
      </Group>
    </div>
  );
}
