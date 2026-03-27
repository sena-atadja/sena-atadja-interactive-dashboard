import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  CheckCircle2, Users, Sliders, ShoppingCart,
  Tag, Store, Award, TrendingUp,
  Volume2, Star, Activity, ArrowRight,
} from "lucide-react";

// ─────────────────────────────────────────────
// BEATS OFFICIAL BRAND PALETTE
// Primary red: #ED1C24 (Pantone PMS 485 C)
// ─────────────────────────────────────────────
const B = {
  red:      "#ED1C24",
  redDark:  "#B5141A",
  redDeep:  "#7A0D10",
  redGlow:  "rgba(237,28,36,0.12)",
  redGlow2: "rgba(237,28,36,0.06)",
  black:    "#000000",
  bg:       "#050505",
  s1:       "#0F0F0F",
  s2:       "#161616",
  s3:       "#1E1E1E",
  g1:       "#2A2A2A",
  g2:       "#444444",
  g3:       "#666666",
  g4:       "#999999",
  white:    "#FFFFFF",
  offWhite: "#F0F0F0",
  border:   "rgba(255,255,255,0.07)",
  border2:  "rgba(255,255,255,0.04)",
};

// ── Survey Data ───────────────────────────────
const AGE_DATA = [
  { label: "18–24",       value: 76.98 },
  { label: "25–34",       value: 10.96 },
  { label: "45–54",       value: 3.65  },
  { label: "35–44",       value: 3.29  },
  { label: "Under 18",    value: 2.92  },
  { label: "55–64",       value: 1.71  },
  { label: "65 and over", value: 0.49  },
];
const GENDER_DATA = [
  { name: "Female",            value: 56.88 },
  { name: "Male",              value: 40.07 },
  { name: "Non-binary",        value: 1.58  },
  { name: "Prefer not to say", value: 1.46  },
];
const INCOME_DATA = [
  { label: "Prefer not to say", value: 30.09 },
  { label: ">$100k",            value: 20.58 },
  { label: "<$25k",             value: 16.69 },
  { label: "$25–50k",           value: 11.21 },
  { label: "$50–75k",           value: 10.96 },
  { label: "$75–100k",          value: 10.48 },
];
const FEATURES_DATA = [
  {label:"Sound Quality",value:35.1},{label:"Design / Looks",value:21.0},
  {label:"Price",value:18.7},{label:"Durability",value:9.8},
  {label:"Connectivity",value:8.9},{label:"Battery Life",value:5.9},
];
const PURCHASE_DATA = [
  {label:"Price",value:3.92},{label:"Brand Reputation",value:3.67},
  {label:"Online Reviews",value:3.41},{label:"Specific Features",value:3.41},
  {label:"Expert Reviews",value:3.37},{label:"Friend / Family",value:2.89},
  {label:"Advertising",value:2.43},
];
const PRICE_DATA = [
  {label:"< $50",value:1128},{label:"$50–$100",value:1243},
  {label:"$100–$200",value:838},{label:"$200–$300",value:245},{label:"> $300",value:118},
];
const CHANNEL_DATA = [
  {label:"Amazon / Online",value:1634},{label:"Electronics Stores",value:736},
  {label:"Department Stores",value:646},{label:"Brand Websites",value:481},
];
const BRAND_DATA = [
  {label:"JBL",value:62.5},{label:"Bose",value:32.2},{label:"Sony",value:24.5},
  {label:"Samsung",value:14.7},{label:"Marshall",value:5.9},
  {label:"Beats",value:2.0},{label:"Apple",value:1.1},
  {label:"Anker",value:0.9},{label:"Sonos",value:0.8},
];
const GENDER_COLORS = [B.red, B.g1, B.g2, "#111"];

const NAV_SECTIONS = [
  {id:"recommendation", label:"Recommendation",  icon:CheckCircle2},
  {id:"survey",         label:"Survey",          icon:Users},
  {id:"features",       label:"Features",        icon:Sliders},
  {id:"purchase",       label:"Purchase Factors",icon:ShoppingCart},
  {id:"price",          label:"Price Points",    icon:Tag},
  {id:"channels",       label:"Channels",        icon:Store},
  {id:"brands",         label:"Brands",          icon:Award},
];

// ── Shared Tooltip ────────────────────────────
const DarkTooltip = ({active,payload,label,suffix=""}) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const disp = typeof v === "number" && v%1!==0 ? v.toFixed(2) : v.toLocaleString();
  return (
    <div style={{background:B.s3,border:`1px solid ${B.g1}`,padding:"10px 14px",borderRadius:4,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
      <p style={{color:B.g4,fontSize:11,marginBottom:4}}>{label}</p>
      <p style={{color:B.white,fontSize:14,fontWeight:600}}>{disp}{suffix}</p>
    </div>
  );
};

// ── UI Components ─────────────────────────────
const IconBadge = ({icon:Icon,size=18}) => (
  <div style={{
    width:40,height:40,borderRadius:8,flexShrink:0,
    background:`linear-gradient(135deg,${B.redDeep},${B.red})`,
    display:"flex",alignItems:"center",justifyContent:"center",
    boxShadow:`0 4px 16px ${B.redGlow}`,
  }}>
    <Icon size={size} color={B.white} strokeWidth={2}/>
  </div>
);

const SectionHeader = ({num,title,icon:Icon}) => (
  <div style={{borderBottom:`1px solid ${B.border}`,paddingBottom:22,marginBottom:44,display:"flex",alignItems:"flex-end",gap:18}}>
    {Icon && <IconBadge icon={Icon}/>}
    <div>
      <div style={{fontFamily:"monospace",fontSize:10,color:B.red,textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:6}}>{num}</div>
      <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:40,color:B.white,lineHeight:1}}>{title}</div>
    </div>
  </div>
);

const KpiCard = ({num,label,sub,icon:Icon}) => {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      background:B.s1,border:`1px solid ${h?B.red:B.border}`,padding:"22px 18px",
      transition:"border-color 0.22s,box-shadow 0.22s",cursor:"default",
      boxShadow:h?`0 0 20px ${B.redGlow}`:undefined,
    }}>
      {Icon && <Icon size={16} color={h?B.red:B.g3} style={{marginBottom:10,transition:"color 0.22s"}} strokeWidth={1.5}/>}
      <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:46,color:B.red,lineHeight:1}}>{num}</div>
      <div style={{fontSize:11,color:B.g3,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>{label}</div>
      {sub && <div style={{fontSize:11,color:B.g4,marginTop:7,lineHeight:1.5}}>{sub}</div>}
    </div>
  );
};

const Takeaway = ({children}) => (
  <div style={{background:B.s3,borderLeft:`3px solid ${B.red}`,padding:"13px 17px",marginTop:22,boxShadow:`-3px 0 14px ${B.redGlow2}`}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
      <ArrowRight size={11} color={B.red} strokeWidth={2.5}/>
      <span style={{fontFamily:"monospace",fontSize:10,color:B.red,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:600}}>Strategic Takeaway</span>
    </div>
    <div style={{fontSize:12,color:B.g4,lineHeight:1.65}}>{children}</div>
  </div>
);

const ChartLabel = ({children}) => (
  <div style={{fontFamily:"monospace",fontSize:10,color:B.g3,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:14}}>{children}</div>
);

const InsightCard = ({tag,title,body,icon:Icon}) => {
  const [h,setH]=useState(false);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{
      borderLeft:`2px solid ${h?B.red:B.border}`,
      background:h?"#140808":B.s3,
      padding:"17px 21px",marginBottom:2,transition:"all 0.2s",cursor:"default",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:7}}>
        {Icon && <Icon size={12} color={B.red} strokeWidth={2}/>}
        <span style={{fontFamily:"monospace",fontSize:10,color:B.red,textTransform:"uppercase",letterSpacing:"0.12em"}}>{tag}</span>
      </div>
      <div style={{fontSize:13,fontWeight:500,color:B.white,marginBottom:5}}>{title}</div>
      <div style={{fontSize:12,color:B.g4,lineHeight:1.6}}>{body}</div>
    </div>
  );
};

const AnalysisLayout = ({reverse=false,chart,eyebrow,headline,caption,synthesis,takeaway}) => {
  const chartPanel = (
    <div style={{background:B.s1,border:`1px solid ${B.border}`,padding:26}}>{chart}</div>
  );
  const textPanel = (
    <div style={{background:B.s1,border:`1px solid ${B.border}`,padding:26,display:"flex",flexDirection:"column"}}>
      <div style={{flex:1}}>
        <div style={{fontFamily:"monospace",fontSize:10,color:B.red,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:9}}>{eyebrow}</div>
        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:26,color:B.white,lineHeight:1.05,marginBottom:16}}>{headline}</div>
        <div style={{fontSize:12,color:B.g4,lineHeight:1.65,borderLeft:`2px solid ${B.red}`,paddingLeft:13,fontStyle:"italic",marginBottom:16}}>{caption}</div>
        <div style={{fontSize:12,color:B.g4,lineHeight:1.65}}>{synthesis}</div>
      </div>
      <Takeaway>{takeaway}</Takeaway>
    </div>
  );
  return (
    <div style={{display:"grid",gridTemplateColumns:reverse?"2fr 3fr":"3fr 2fr",gap:2}}>
      {reverse ? <>{textPanel}{chartPanel}</> : <>{chartPanel}{textPanel}</>}
    </div>
  );
};

const bColor = (i,hi=0,hi2=1) => i===hi?B.red:i===hi2?B.redDark:B.g1;

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
export default function BeatsDashboard() {
  const [active,setActive]=useState("recommendation");

  useEffect(()=>{
    const obs = NAV_SECTIONS.map(({id})=>{
      const el=document.getElementById(id);
      if(!el) return null;
      const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setActive(id);},{rootMargin:"-40% 0px -40% 0px"});
      o.observe(el); return o;
    });
    return ()=>obs.forEach(o=>o?.disconnect());
  },[]);

  const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});

  return (
    <div style={{background:B.bg,color:B.offWhite,minHeight:"100vh",fontFamily:"'DM Sans','Segoe UI',sans-serif",fontWeight:300}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${B.black};}
        ::-webkit-scrollbar-thumb{background:${B.redDark};border-radius:2px;}
        p{margin-bottom:10px;} p:last-child{margin-bottom:0;}
        strong{color:${B.offWhite};font-weight:500;}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"sticky",top:0,zIndex:100,
        background:"rgba(5,5,5,0.96)",backdropFilter:"blur(24px)",
        borderBottom:`1px solid ${B.border}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",
        padding:"0 36px",height:56,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{
            width:30,height:30,borderRadius:"50%",
            background:`linear-gradient(135deg,${B.redDark},${B.red})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Bebas Neue',cursive",fontSize:16,color:B.white,
            boxShadow:`0 2px 10px ${B.redGlow}`,
          }}>b</div>
          <span style={{fontFamily:"monospace",fontSize:10,color:B.g3,textTransform:"uppercase",letterSpacing:"0.15em"}}>
            Beats By Dr. Dre · Market Study 2024
          </span>
        </div>

        <div style={{display:"flex",gap:2}}>
          {NAV_SECTIONS.map(({id,label,icon:Icon})=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{
              background:active===id?"rgba(237,28,36,0.1)":"none",border:"none",cursor:"pointer",
              display:"flex",alignItems:"center",gap:5,borderRadius:4,
              fontSize:10,color:active===id?B.red:B.g2,
              textTransform:"uppercase",letterSpacing:"0.08em",
              padding:"5px 9px",transition:"color 0.2s,background 0.2s",
            }}>
              <Icon size={11} strokeWidth={active===id?2.5:2}/>
              {label}
            </button>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:B.red,boxShadow:`0 0 6px ${B.red}`}}/>
          <span style={{fontFamily:"monospace",fontSize:10,color:B.g3,textTransform:"uppercase",letterSpacing:"0.1em"}}>Confidential</span>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        padding:"80px 48px 64px",position:"relative",overflow:"hidden",
        background:`radial-gradient(ellipse 70% 60% at 85% 50%,rgba(237,28,36,0.09) 0%,transparent 65%),
                    radial-gradient(ellipse 30% 40% at 10% 80%,rgba(237,28,36,0.04) 0%,transparent 60%),
                    ${B.black}`,
        borderBottom:`1px solid ${B.border}`,
      }}>
        <div style={{
          position:"absolute",right:-40,top:-80,
          fontFamily:"'Bebas Neue',cursive",fontSize:480,
          color:"rgba(237,28,36,0.04)",lineHeight:1,
          pointerEvents:"none",userSelect:"none",
        }}>b</div>

        <div style={{maxWidth:680,position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <div style={{width:2,height:16,background:B.red}}/>
            <span style={{fontFamily:"monospace",fontSize:11,color:B.red,textTransform:"uppercase",letterSpacing:"0.2em"}}>
              Executive Briefing · Wireless Speaker Opportunity Assessment
            </span>
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',cursive",fontSize:"clamp(56px,8vw,106px)",lineHeight:0.9,color:B.white,marginBottom:30}}>
            SHOULD BEATS<br/>
            LAUNCH A NEW<br/>
            <span style={{color:B.red}}>WIRELESS</span><br/>
            SPEAKER?
          </h1>
          <p style={{fontSize:15,color:B.g4,maxWidth:460,marginBottom:48,lineHeight:1.65}}>
            A data-driven consumer study evaluating market appetite, feature priorities, and go-to-market strategy for a new high-fidelity wireless speaker product.
          </p>
          <div style={{display:"flex",flexWrap:"wrap"}}>
            {[["Study Conducted","July 2024"],["Total Respondents","5,026"],["Speaker Owners","3,572 (71%)"],["Prepared For","CEO & Head of Marketing"]].map(([l,v],i)=>(
              <div key={l} style={{padding:"13px 22px",borderRight:i<3?`1px solid ${B.border}`:undefined}}>
                <div style={{fontFamily:"monospace",fontSize:10,color:B.g3,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:4}}>{l}</div>
                <div style={{fontSize:13,color:B.g4}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 01 RECOMMENDATION ── */}
      <section id="recommendation" style={{padding:"68px 48px",background:B.s1,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="01 · Final Recommendation" title="THE VERDICT" icon={CheckCircle2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:48,alignItems:"start"}}>
          <div style={{position:"sticky",top:68}}>
            <div style={{fontFamily:"monospace",fontSize:10,color:B.g3,textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:11}}>Our Recommendation</div>
            <div style={{
              background:`linear-gradient(135deg,${B.redDark},${B.red})`,
              padding:"26px 30px",marginBottom:10,
              boxShadow:`0 8px 40px rgba(237,28,36,0.25)`,
            }}>
              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:82,color:B.white,lineHeight:0.9}}>LAUNCH.</div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginTop:11,lineHeight:1.55,marginBottom:0}}>
                Data strongly supports entering the market with a high-fidelity, design-forward product at the $100–$200 tier.
              </p>
            </div>
            {[
              {num:"71%",label:"own a wireless speaker — a proven, active market",icon:Volume2},
              {num:"35%",label:"rank sound quality #1 — Beats' core brand equity",icon:Star},
              {num:"2%", label:"Beats' current speaker penetration — vast white space",icon:TrendingUp},
            ].map(({num,label,icon:Icon})=>(
              <div key={num} style={{
                background:B.s2,border:`1px solid ${B.border}`,
                padding:"14px 18px",marginBottom:7,
                display:"flex",alignItems:"center",gap:14,
              }}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:38,color:B.red,lineHeight:1}}>{num}</div>
                  <div style={{fontSize:11,color:B.g3,marginTop:2}}>{label}</div>
                </div>
                <Icon size={18} color={B.g1} style={{marginLeft:"auto"}} strokeWidth={1.5}/>
              </div>
            ))}
          </div>
          <div>
            <InsightCard icon={Users} tag="Target Audience" title="Go after the 18–24 demographic — decisively"
              body="A commanding 77% of all respondents are 18–24. This cohort aligns perfectly with Beats' cultural cachet, celebrity endorsements, and design-forward DNA. This is your home turf — own it."/>
            <InsightCard icon={Sliders} tag="Positioning & Features" title="Lead with sound quality. Follow with aesthetics."
              body="Sound quality was ranked #1 by 35% of respondents. Design/Looks came second at 21%. A high-fidelity speaker with bold Beats aesthetics is a natural product-market fit. Battery life improvements were the top-requested upgrade in open-ended responses."/>
            <InsightCard icon={Tag} tag="Price Strategy" title="Target the $100–$150 sweet spot with a premium anchor"
              body="66% of buyers spent $100 or less, but the $100–$200 tier captures the highest-intent, most brand-loyal buyers. Offer a flagship at $149 and a premium tier at $229. Price is the #1 purchase driver (3.92/5) — value framing in marketing is critical."/>
            <InsightCard icon={Store} tag="Distribution" title="Amazon-first, with a Best Buy anchor for trial"
              body="46% of buyers prefer Amazon above all channels. Invest in a premium storefront, enhanced A+ content, and a review-generation strategy. Maintain physical retail for in-store audition — consumers often hear before they buy online."/>
            <InsightCard icon={Award} tag="Competitive Threat" title="JBL is the dominant incumbent — differentiate, don't match"
              body="JBL has 63% brand penetration vs. Beats' 2%. Competing on price or specs alone is a losing strategy. Leverage brand storytelling, design identity, and artist partnerships to own a premium-lifestyle position JBL cannot replicate."/>
            <InsightCard icon={Activity} tag="Marketing Channels" title="Prioritize brand reputation and reviews over advertising"
              body="Advertising scored lowest at 2.43/5. Brand reputation (3.67) and price (3.92) lead the purchase decision. Allocate budgets toward credible reviews, authentic UGC, and Amazon review velocity rather than paid media."/>
          </div>
        </div>
      </section>

      {/* ── 02 SURVEY DETAILS ── */}
      <section id="survey" style={{padding:"68px 48px",background:B.bg,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="02 · Survey Details" title="WHO WE ASKED" icon={Users}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:14}}>
          <KpiCard icon={Activity} num="5,026" label="Total Respondents" sub="Collected via Google Forms, July 2024"/>
          <KpiCard icon={Volume2}  num="71%"   label="Speaker Owners"   sub="3,572 respondents who own a wireless speaker"/>
          <KpiCard icon={Users}    num="77%"   label="Aged 18–24"       sub="Core target demographic — largest single segment"/>
          <KpiCard icon={Star}     num="53%"   label="Female"           sub="Slight female skew in surveyed population"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2}}>
          <div style={{background:B.s1,border:`1px solid ${B.border}`,padding:22}}>
            <ChartLabel>Age Distribution</ChartLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={AGE_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis dataKey="label" tick={{fill:B.g3,fontSize:10}} axisLine={{stroke:B.border}} tickLine={false}/>
                <YAxis tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/>
                <Tooltip content={<DarkTooltip suffix="%"/>}/>
                <Bar dataKey="value" radius={[2,2,0,0]}>
                  {AGE_DATA.map((_,i)=><Cell key={i} fill={i===0?B.red:B.g1}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:B.s1,border:`1px solid ${B.border}`,padding:22}}>
            <ChartLabel>Gender Distribution</ChartLabel>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={GENDER_DATA} dataKey="value" nameKey="name" cx="50%" cy="42%" innerRadius={52} outerRadius={72} paddingAngle={2}>
                  {GENDER_DATA.map((_,i)=><Cell key={i} fill={GENDER_COLORS[i]}/>)}
                </Pie>
                <Legend iconSize={8} wrapperStyle={{fontSize:11,color:B.g3}}/>
                <Tooltip content={<DarkTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{background:B.s1,border:`1px solid ${B.border}`,padding:22}}>
            <ChartLabel>Household Income Distribution</ChartLabel>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={INCOME_DATA} margin={{top:0,right:0,left:-20,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis dataKey="label" tick={{fill:B.g3,fontSize:10}} axisLine={{stroke:B.border}} tickLine={false}/>
                <YAxis tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/>
                <Tooltip content={<DarkTooltip suffix="%"/>}/>
                <Bar dataKey="value" radius={[2,2,0,0]}>
                  {INCOME_DATA.map((_,i)=><Cell key={i} fill={i===1?B.red:B.g1}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* ── 03 FEATURES ── */}
      <section id="features" style={{padding:"68px 48px",background:B.s1,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="03 · Important Features" title="WHAT CONSUMERS WANT" icon={Sliders}/>
        <AnalysisLayout
          eyebrow="Chart Interpretation"
          headline="SOUND DOMINATES. DESIGN IS A CLOSE SECOND."
          caption="Respondents ranked six wireless speaker attributes from most to least important. Chart shows the % who ranked each feature as their single top priority."
          synthesis={<>
            <p><strong>Sound Quality leads at 35%</strong> — more than any other attribute by a wide margin. This is Beats' foundational brand promise and represents clear product-market alignment.</p>
            <p><strong>Design/Looks ranks second at 21%</strong>, reflecting that wireless speakers are increasingly lifestyle accessories. Beats' iconic design language is a genuine competitive advantage.</p>
            <p><strong>Price is third at 19%</strong>, suggesting consumers won't sacrifice quality for cost — opening room for a premium price point without sacrificing volume.</p>
            <p><strong>Battery Life scored lowest</strong> as a #1 priority but appeared frequently in open-ended responses. Treat as a hygiene factor: must meet baseline, won't win sales alone.</p>
          </>}
          takeaway="Build the product story around sound quality first, design identity second. Battery life (12+ hr target) must meet baseline expectations. Market in that order."
          chart={<>
            <ChartLabel>% of respondents ranking each feature as most important (#1)</ChartLabel>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FEATURES_DATA} margin={{top:0,right:10,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis dataKey="label" tick={{fill:B.g3,fontSize:10}} axisLine={{stroke:B.border}} tickLine={false}/>
                <YAxis tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"} domain={[0,42]}/>
                <Tooltip content={<DarkTooltip suffix="%"/>}/>
                <Bar dataKey="value" radius={[3,3,0,0]}>
                  {FEATURES_DATA.map((_,i)=><Cell key={i} fill={bColor(i)}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        />
      </section>

      {/* ── 04 PURCHASE FACTORS ── */}
      <section id="purchase" style={{padding:"68px 48px",background:B.bg,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="04 · Purchase Decision Factors" title="WHAT DRIVES THE BUY" icon={ShoppingCart}/>
        <AnalysisLayout reverse
          eyebrow="Chart Interpretation"
          headline="PRICE & BRAND REPUTATION MOVE THE NEEDLE."
          caption="Respondents rated seven purchase-decision factors on a 1–5 importance scale. Bars show average scores across all 3,572 speaker owners."
          synthesis={<>
            <p><strong>Price leads at 3.92/5</strong> — consumers want the best at a fair price, not the cheapest. Beats must communicate value, not cost.</p>
            <p><strong>Brand Reputation scores 3.67/5</strong>, the second-highest driver. Beats' headphone halo can be powerfully leveraged into the speaker category.</p>
            <p><strong>Online and Expert Reviews both score ~3.4</strong> — consumers research before buying. Seeding reviews at launch directly impacts conversion velocity.</p>
            <p><strong>Advertising scores the lowest at 2.43/5</strong> — paid ads alone will not move product. Organic credibility is the real lever. Reallocate budgets accordingly.</p>
          </>}
          takeaway="Invest marketing budgets in PR, influencer seeding, and review generation over pure paid advertising. Lean into the Beats brand halo and communicate value clearly."
          chart={<>
            <ChartLabel>Average importance rating (1–5 scale, n=3,572 owners)</ChartLabel>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PURCHASE_DATA} layout="vertical" margin={{top:0,right:10,left:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis type="number" domain={[0,5]} tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="label" tick={{fill:B.g4,fontSize:11}} axisLine={false} tickLine={false} width={120}/>
                <Tooltip content={<DarkTooltip suffix=" / 5"/>}/>
                <Bar dataKey="value" radius={[0,3,3,0]}>
                  {PURCHASE_DATA.map((_,i)=><Cell key={i} fill={bColor(i)}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        />
      </section>

      {/* ── 05 PRICE POINTS ── */}
      <section id="price" style={{padding:"68px 48px",background:B.s1,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="05 · Price Point Preferences" title="WHAT THEY PAY" icon={Tag}/>
        <AnalysisLayout
          eyebrow="Chart Interpretation"
          headline="$50–$100 RULES TODAY. $100–$200 IS THE GROWTH ZONE."
          caption="Respondents reported how much they paid for their current speaker — revealed preference from actual purchasing behavior, not stated intent."
          synthesis={<>
            <p><strong>The $50–$100 range is today's volume leader</strong> — 35% of owners paid here. This is JBL's home turf and a price war Beats cannot, and should not, fight.</p>
            <p><strong>The $100–$200 tier (24%) is the strategic entry point.</strong> Buyers here are more brand-conscious, more satisfied, and more likely to advocate. This is the natural Beats home.</p>
            <p><strong>Only 10% paid over $200</strong>, suggesting a high-end SKU can anchor perception without needing to drive volume.</p>
            <p><strong>31% paid under $50</strong> — price-sensitive, largely inaccessible for a premium brand. Do not compete here; it dilutes brand equity.</p>
          </>}
          takeaway="Launch primary SKU at $129–$149. Introduce a premium variant at $199–$229 as aspirational anchor. Never go sub-$100 — it triggers a margin war and dilutes equity."
          chart={<>
            <ChartLabel>Amount spent on current wireless speaker (n=3,572 owners)</ChartLabel>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={PRICE_DATA} margin={{top:0,right:10,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis dataKey="label" tick={{fill:B.g3,fontSize:10}} axisLine={{stroke:B.border}} tickLine={false}/>
                <YAxis tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<DarkTooltip suffix=" owners"/>}/>
                <Bar dataKey="value" radius={[3,3,0,0]}>
                  {PRICE_DATA.map((_,i)=><Cell key={i} fill={i===2?B.red:i===3?B.redDark:B.g1}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        />
      </section>

      {/* ── 06 CHANNELS ── */}
      <section id="channels" style={{padding:"68px 48px",background:B.bg,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="06 · Purchasing Channel Preferences" title="WHERE THEY BUY" icon={Store}/>
        <AnalysisLayout reverse
          eyebrow="Chart Interpretation"
          headline="AMAZON IS THE DOMINANT ARENA."
          caption="Respondents indicated their preferred channel for purchasing wireless speakers. Major channels shown; miscellaneous write-ins consolidated."
          synthesis={<>
            <p><strong>Amazon captures 46% of preferred purchase intent</strong> — by far the most important channel. An exceptional Amazon presence is non-negotiable for launch success.</p>
            <p><strong>Physical electronics stores account for 21%</strong> — matters for discovery and audition. Consumers hear the product in-store, then buy online.</p>
            <p><strong>Department stores (18%)</strong> — important for reach among the under-25 demographic who frequents Target and Walmart regularly.</p>
            <p><strong>Brand websites at 13%</strong> — skews toward loyal buyers. Worth investing in for customer data and margin, but secondary for volume at launch.</p>
          </>}
          takeaway="Amazon is the launch battleground. Build a premium storefront with A+ content and seeded reviews. Use Best Buy/Target for physical trial. Beats.com for loyalty and data capture."
          chart={<>
            <ChartLabel>Preferred purchase channel — % of owners (n=3,497 valid responses)</ChartLabel>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={CHANNEL_DATA} layout="vertical" margin={{top:0,right:10,left:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis type="number" tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="label" tick={{fill:B.g4,fontSize:11}} axisLine={false} tickLine={false} width={150}/>
                <Tooltip content={<DarkTooltip suffix=" buyers"/>}/>
                <Bar dataKey="value" radius={[0,3,3,0]}>
                  {CHANNEL_DATA.map((_,i)=><Cell key={i} fill={i===0?B.red:B.g1}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        />
      </section>

      {/* ── 07 BRAND RECOGNITION ── */}
      <section id="brands" style={{padding:"68px 48px",background:B.s1,borderBottom:`1px solid ${B.border}`}}>
        <SectionHeader num="07 · Brand Recognition" title="THE COMPETITIVE LANDSCAPE" icon={Award}/>
        <AnalysisLayout
          eyebrow="Chart Interpretation"
          headline="JBL DOMINATES. BEATS IS A FOOTNOTE — FOR NOW."
          caption="Respondents selected all wireless speaker brands they own or have previously used. This reveals unaided brand penetration across the target market."
          synthesis={<>
            <p><strong>JBL commands 63% penetration</strong> — nearly two-thirds of owners have used a JBL. It is the category default built on years of price-performance credibility. Beats cannot out-JBL JBL.</p>
            <p><strong>Bose (32%) and Sony (25%) occupy the premium tier</strong>, signaling that consumers actively trade up for quality. There is an established upper market Beats can realistically compete for.</p>
            <p><strong>Beats sits at just 2%</strong> — near-invisible despite enormous headphone brand equity. No baggage, only potential. This is a white space opportunity, not a liability.</p>
            <p><strong>Marshall (6%)</strong> is a design-oriented lifestyle competitor worth monitoring as a brand-led entrant carving meaningful share without volume pricing.</p>
          </>}
          takeaway="Position against Bose and Sony — not JBL. Target consumers who already understand premium audio and want a product that signals taste, identity, and cultural relevance."
          chart={<>
            <ChartLabel>Brand ownership/usage — % of speaker owners who have used each brand (multi-select, n=3,572)</ChartLabel>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={BRAND_DATA} layout="vertical" margin={{top:0,right:10,left:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.border2}/>
                <XAxis type="number" tick={{fill:B.g3,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>v+"%"}/>
                <YAxis type="category" dataKey="label" tick={{fill:B.g4,fontSize:11}} axisLine={false} tickLine={false} width={72}/>
                <Tooltip content={<DarkTooltip suffix="%"/>}/>
                <Bar dataKey="value" radius={[0,3,3,0]}>
                  {BRAND_DATA.map((d,i)=>(
                    <Cell key={i} fill={d.label==="Beats"?B.red:d.label==="JBL"?B.g2:B.g1}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>}
        />
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background:B.black,borderTop:`1px solid ${B.border}`,
        padding:"26px 48px",display:"flex",justifyContent:"space-between",alignItems:"center",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{
            width:26,height:26,borderRadius:"50%",
            background:`linear-gradient(135deg,${B.redDark},${B.red})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'Bebas Neue',cursive",fontSize:14,color:B.white,
          }}>b</div>
          <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:17,color:B.g3,letterSpacing:"0.05em"}}>BEATS BY DR. DRE</span>
        </div>
        <div style={{fontFamily:"monospace",fontSize:10,color:B.g3,textAlign:"right",lineHeight:1.8}}>
          Wireless Speaker Market Study · July 2024<br/>
          Confidential — For Internal Use Only
        </div>
      </footer>
    </div>
  );
}
