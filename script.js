(() => {
  "use strict";

  const CONFIG = typeof ALIRZAEV_CONFIG !== "undefined" ? ALIRZAEV_CONFIG : window.ALIRZAEV_CONFIG;
  if (!CONFIG) return;

  const root = document.documentElement;
  const qs = (selector, context = document) => context.querySelector(selector);
  const qsa = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const totalSteps = 5;

  const state = {
    step: 1,
    services: new Set(),
    venueType: "",
    deadline: "",
    photos: "",
    otherService: "",
    venueOther: "",
    details: {
      name: "",
      description: "",
      wishes: ""
    },
    lastMessage: ""
  };

  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));

  const nl2br = (value = "") => escapeHTML(value).replace(/\n/g, "<br>");

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "";
    if (typeof price === "number") return `${new Intl.NumberFormat("ru-RU").format(price)} ₽`;
    return String(price);
  };

  const icons = {
    spark: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c.6 4.7 3.3 7.4 8 8-4.7.6-7.4 3.3-8 8-.6-4.7-3.3-7.4-8-8 4.7-.6 7.4-3.3 8-8Z"/><path d="M19 17.5c.2 1.2.8 1.8 2 2-1.2.2-1.8.8-2 2-.2-1.2-.8-1.8-2-2 1.2-.2 1.8-.8 2-2Z"/></svg>`,
    touch: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V6.5a2 2 0 0 1 4 0V11"/><path d="M13 10.5V9a2 2 0 0 1 4 0v2"/><path d="M17 11.5v-.7a1.8 1.8 0 0 1 3.6 0V15a6 6 0 0 1-6 6h-1.2a5 5 0 0 1-3.5-1.5L6 16a1.8 1.8 0 0 1 2.5-2.6L11 15.5V11"/><path d="M3 6V4M1 6h2M4 9l1-1M4 3 3 4"/></svg>`,
    devices: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="13" height="10" rx="1.5"/><path d="M6 18.5h6M9 14.5v4"/><rect x="16" y="8" width="5.5" height="11" rx="1.4"/><path d="M18 16.5h1.5"/></svg>`,
    detail: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5M8 10.5h5M10.5 8v5"/></svg>`,
    person: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-4 3-6 7-6s6.4 2 7 6"/><circle cx="12" cy="12" r="10" stroke-dasharray="2 5"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`
  };

  const socialIcons = {
    telegram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 4.3 2.8 11.5c-.9.3-.9 1.5.1 1.8l4.6 1.4 1.8 5.4c.3.8 1.2 1 1.8.4l2.4-2.3 4.6 3.4c.7.5 1.7.1 1.9-.8l2.7-15.4c.2-.9-.7-1.6-1.3-1.1ZM8.6 14.2l9.3-6.7-7.6 7.8-.2 3.2-1.5-4.3Z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 2.5h9.6a4.7 4.7 0 0 1 4.7 4.7v9.6a4.7 4.7 0 0 1-4.7 4.7H7.2a4.7 4.7 0 0 1-4.7-4.7V7.2a4.7 4.7 0 0 1 4.7-4.7Zm0 1.9A2.8 2.8 0 0 0 4.4 7.2v9.6a2.8 2.8 0 0 0 2.8 2.8h9.6a2.8 2.8 0 0 0 2.8-2.8V7.2a2.8 2.8 0 0 0-2.8-2.8H7.2Zm4.8 3.1a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.9a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Zm5-2.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/></svg>`,
    behance: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 5.5h5.7c2.2 0 3.6 1 3.6 2.8 0 1.2-.6 2-1.7 2.5 1.5.4 2.3 1.4 2.3 2.9 0 2-1.6 3.3-4.1 3.3H2.5v-11.5Zm5.2 4.5c1 0 1.5-.4 1.5-1.2 0-.8-.6-1.1-1.5-1.1H5v2.3h2.7Zm.2 4.8c1.2 0 1.8-.5 1.8-1.4 0-.9-.6-1.4-1.8-1.4H5v2.8h2.9ZM15 7h5.9v1.5H15V7Zm2.9 2.3c2.5 0 4.1 1.8 4.1 4.4v.6h-6c.2 1.1.9 1.8 2 1.8.9 0 1.5-.4 1.8-1h2c-.5 1.8-1.9 2.8-3.9 2.8-2.5 0-4.2-1.8-4.2-4.3 0-2.5 1.7-4.3 4.2-4.3Zm-1.9 3.5h3.7c-.2-1-.8-1.6-1.8-1.6-1 0-1.7.6-1.9 1.6Z"/></svg>`
  };

  const serviceArt = {
    menu: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="rotate(4 220 110)">
        <rect x="157" y="17" width="126" height="228" rx="22" fill="#151920" stroke="#3F4651" stroke-width="1.2"/>
        <rect x="165" y="26" width="110" height="210" rx="16" fill="#F8F6F1"/>
        <rect x="199" y="32" width="42" height="7" rx="3.5" fill="#14181E"/>
        <rect x="176" y="50" width="54" height="7" rx="3.5" fill="#242A31"/>
        <rect x="176" y="62" width="35" height="4" rx="2" fill="#ADB5B1"/>
        <rect x="176" y="75" width="88" height="58" rx="9" fill="#DCE5DE"/>
        <circle cx="220" cy="103" r="20" fill="#F7F8F4"/>
        <path d="M210 96c4 5 13 8 19 4-3 9-16 12-22 5-2-2-1-5 3-7v-2Z" fill="#21E6A3"/>
        <rect x="176" y="141" width="88" height="4" rx="2" fill="#AEB6B2"/>
        <rect x="176" y="151" width="62" height="4" rx="2" fill="#D2D9D4"/>
        <rect x="176" y="166" width="88" height="25" rx="7" fill="#21E6A3" fill-opacity=".16"/>
        <circle cx="187" cy="178.5" r="4" fill="#21E6A3"/>
        <rect x="197" y="176" width="37" height="4" rx="2" fill="#74AD98"/>
      </g>
      <circle cx="311" cy="162" r="35" fill="#FFFFFF" stroke="#E2E7E4"/>
      <circle cx="311" cy="162" r="23" fill="#E4EBE5"/>
      <path d="M299 152c9 3 15 13 7 21-5 5-13 2-14-4-1-4 2-7 6-6" stroke="#21E6A3" stroke-width="3" stroke-linecap="round"/>
      <rect x="52" y="52" width="105" height="58" rx="11" fill="#FFFFFF" stroke="#E1E6E2"/>
      <circle cx="69" cy="73" r="8" fill="#21E6A3" fill-opacity=".18"/>
      <path d="m66 73 2 2 4-5" stroke="#08A98D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="84" y="67" width="53" height="5" rx="2.5" fill="#1A1F25"/>
      <rect x="84" y="77" width="36" height="4" rx="2" fill="#C0C7C3"/>
      <rect x="64" y="92" width="78" height="3" rx="1.5" fill="#E2E8E3"/>
      <rect x="72" y="124" width="66" height="3" rx="1.5" fill="#08BFC5" fill-opacity=".5"/>
      <circle cx="64" cy="126" r="2.5" fill="#21E6A3"/>
      <path d="M311 62v33M294.5 78.5h33" stroke="#08BFC5" stroke-opacity=".35" stroke-linecap="round"/>
    </svg>`,
    qr: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="221" cy="111" r="96" fill="#FFFFFF" fill-opacity=".4" stroke="#DDE4E1"/>
      <rect x="157" y="28" width="128" height="128" rx="15" fill="#FFFFFF" stroke="#E1E7E3"/>
      <g fill="#12161C">
        <path d="M170 41h33v33h-33V41Zm7 7v19h19V48h-19Z"/><rect x="181" y="52" width="11" height="11" rx=".7"/>
        <path d="M239 41h33v33h-33V41Zm7 7v19h19V48h-19Z"/><rect x="250" y="52" width="11" height="11" rx=".7"/>
        <path d="M170 110h33v33h-33v-33Zm7 7v19h19v-19h-19Z"/><rect x="181" y="121" width="11" height="11" rx=".7"/>
        <rect x="239" y="41" width="5" height="5" rx="1"/><rect x="247" y="55" width="5" height="5" rx="1"/>
        <rect x="239" y="86" width="5" height="5" rx="1"/><rect x="250" y="95" width="5" height="5" rx="1"/>
        <rect x="263" y="86" width="5" height="5" rx="1"/><rect x="273" y="96" width="5" height="5" rx="1"/>
        <rect x="210" y="41" width="5" height="5" rx="1"/><rect x="218" y="50" width="5" height="5" rx="1"/>
        <rect x="208" y="59" width="5" height="5" rx="1"/><rect x="219" y="71" width="5" height="5" rx="1"/>
        <rect x="208" y="82" width="5" height="5" rx="1"/><rect x="222" y="91" width="5" height="5" rx="1"/>
        <rect x="210" y="110" width="5" height="5" rx="1"/><rect x="220" y="119" width="5" height="5" rx="1"/>
        <rect x="208" y="128" width="5" height="5" rx="1"/><rect x="222" y="138" width="5" height="5" rx="1"/>
        <rect x="239" y="110" width="5" height="5" rx="1"/><rect x="249" y="120" width="5" height="5" rx="1"/>
        <rect x="260" y="110" width="5" height="5" rx="1"/><rect x="272" y="121" width="5" height="5" rx="1"/>
        <rect x="262" y="135" width="5" height="5" rx="1"/><rect x="273" y="143" width="5" height="5" rx="1"/>
        <rect x="239" y="136" width="5" height="5" rx="1"/><rect x="250" y="145" width="5" height="5" rx="1"/>
      </g>
      <rect x="160" y="89" width="122" height="2" rx="1" fill="#21E6A3"/>
      <path d="M142 52V39h13M300 52V39h-13M142 132v13h13M300 132v13h-13" stroke="#08BFC5" stroke-width="2" stroke-linecap="round"/>
      <rect x="54" y="42" width="93" height="30" rx="15" fill="#FFFFFF" stroke="#DEE5E1"/>
      <circle cx="71" cy="57" r="4" fill="#21E6A3"/>
      <rect x="80" y="51" width="43" height="4" rx="2" fill="#1A1F25"/>
      <rect x="80" y="59" width="29" height="3" rx="1.5" fill="#BBC3BE"/>
      <rect x="66" y="147" width="112" height="34" rx="17" fill="#12161C"/>
      <rect x="80" y="160" width="48" height="4" rx="2" fill="#FFFFFF" fill-opacity=".75"/>
      <rect x="138" y="158" width="16" height="8" rx="4" fill="#21E6A3"/>
      <path d="M288 139c0-8 6-14 14-14s14 6 14 14v18h-28v-18Z" fill="#F8FBF8" stroke="#E2E7E3"/>
      <rect x="294" y="128" width="16" height="24" rx="4" fill="#DDE8E1"/>
      <circle cx="302" cy="140" r="5" fill="#21E6A3"/>
    </svg>`,
    restaurant: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="78" y="24" width="284" height="172" rx="14" fill="#FFFFFF" stroke="#E0E5E2"/>
      <rect x="78" y="24" width="284" height="24" rx="14" fill="#F2F5F2"/>
      <circle cx="93" cy="36" r="2.5" fill="#C8CfcB"/><circle cx="102" cy="36" r="2.5" fill="#C8CFCB"/><circle cx="111" cy="36" r="2.5" fill="#C8CFCB"/>
      <rect x="89" y="57" width="262" height="80" rx="8" fill="#DDE5DF"/>
      <circle cx="220" cy="97" r="27" fill="#F7F8F5"/>
      <circle cx="220" cy="97" r="18" fill="#D8E4DB"/>
      <path d="M210 92c4 4 10 5 15 2-3 8-12 10-17 4-2-3 0-5 2-6Z" fill="#21E6A3"/>
      <path d="M151 84c4 6 6 13 6 20M151 84v55M161 84v19c0 5-3 8-5 8" stroke="#A1AAA5" stroke-width="2" stroke-linecap="round"/>
      <path d="M284 84v20a7 7 0 0 1-7 7v28M291 84c0 11-2 20-7 27" stroke="#A1AAA5" stroke-width="2" stroke-linecap="round"/>
      <rect x="89" y="148" width="94" height="8" rx="4" fill="#1B2026"/>
      <rect x="89" y="163" width="153" height="4" rx="2" fill="#C7CECA"/>
      <rect x="89" y="174" width="119" height="4" rx="2" fill="#E0E5E2"/>
      <rect x="275" y="150" width="76" height="25" rx="12.5" fill="#21E6A3" fill-opacity=".18"/>
      <rect x="286" y="160" width="54" height="5" rx="2.5" fill="#299F84"/>
      <rect x="54" y="75" width="66" height="53" rx="10" fill="#12161C"/>
      <rect x="64" y="87" width="30" height="4" rx="2" fill="#21E6A3"/>
      <rect x="64" y="97" width="45" height="3" rx="1.5" fill="#FFFFFF" fill-opacity=".6"/>
      <rect x="64" y="106" width="23" height="3" rx="1.5" fill="#FFFFFF" fill-opacity=".28"/>
      <circle cx="327" cy="58" r="17" fill="#08BFC5" fill-opacity=".16" stroke="#08BFC5" stroke-opacity=".28"/>
      <path d="M322 58h10M327 53v10" stroke="#087F86" stroke-linecap="round"/>
      <path d="M60 158c12-12 22-12 34 0" stroke="#21E6A3" stroke-opacity=".35" stroke-linecap="round"/>
    </svg>`,
    cafe: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="225" y="42" width="143" height="138" rx="13" fill="#FFFFFF" stroke="#E0E5E2"/>
      <rect x="225" y="42" width="143" height="22" rx="13" fill="#F3F5F2"/>
      <circle cx="239" cy="53" r="2.2" fill="#C6CDC9"/><circle cx="247" cy="53" r="2.2" fill="#C6CDC9"/><circle cx="255" cy="53" r="2.2" fill="#C6CDC9"/>
      <rect x="238" y="76" width="117" height="48" rx="7" fill="#E5EBE5"/>
      <path d="M274 114c8-8 21-8 29 0" stroke="#21E6A3" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M278 104c4-5 13-5 17 0" stroke="#A8B9AC" stroke-width="2" stroke-linecap="round"/>
      <rect x="238" y="134" width="83" height="5" rx="2.5" fill="#1B2026"/>
      <rect x="238" y="146" width="108" height="4" rx="2" fill="#CDD4CF"/>
      <rect x="238" y="156" width="72" height="4" rx="2" fill="#E2E7E3"/>
      <circle cx="148" cy="107" r="62" fill="#FFFFFF" stroke="#E0E5E2"/>
      <circle cx="148" cy="107" r="49" fill="#E7DFD2"/>
      <circle cx="148" cy="107" r="38" fill="#F0EAE0"/>
      <path d="M133 104c2-11 10-19 21-21-2 12-10 21-21 21Z" fill="#CDB99A"/>
      <path d="M143 101c9-11 19-15 28-13-6 11-16 17-28 13Z" fill="#FFFFFF" fill-opacity=".7"/>
      <path d="M117 88c9 3 14 10 15 20" stroke="#D4C4AB" stroke-width="3" stroke-linecap="round"/>
      <circle cx="199" cy="91" r="13" fill="#21E6A3" fill-opacity=".18"/>
      <path d="m194 91 3 3 7-8" stroke="#0C9B83" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M120 44c-8-10 7-12 0-22M140 38c-7-8 6-11 0-19" stroke="#08BFC5" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/>
      <rect x="58" y="155" width="102" height="34" rx="17" fill="#12161C"/>
      <circle cx="79" cy="172" r="7" fill="#21E6A3" fill-opacity=".18"/>
      <path d="M76 172h6M79 169v6" stroke="#21E6A3" stroke-width="1.5" stroke-linecap="round"/>
      <rect x="93" y="165" width="48" height="4" rx="2" fill="#FFFFFF" fill-opacity=".64"/>
      <rect x="93" y="174" width="31" height="3" rx="1.5" fill="#FFFFFF" fill-opacity=".25"/>
      <path d="M188 176h67" stroke="#08BFC5" stroke-opacity=".28" stroke-linecap="round" stroke-dasharray="3 5"/>
    </svg>`,
    bar: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="64" y="34" width="312" height="154" rx="14" fill="#FFFFFF" fill-opacity=".72" stroke="#E0E5E2"/>
      <circle cx="319" cy="72" r="30" fill="#08BFC5" fill-opacity=".08"/>
      <circle cx="319" cy="72" r="21" fill="#08BFC5" fill-opacity=".1"/>
      <path d="M105 56h56v6c0 6-4 10-10 10v82h-9V72c-6 0-11-4-11-10v-6h-8v-6h8v-9h9v9h8v6h-43v-6Z" fill="#1B2026"/>
      <path d="M108 62h48v3c0 4-3 7-7 7h-34c-4 0-7-3-7-7v-3Z" fill="#21E6A3" fill-opacity=".2"/>
      <rect x="132" y="72" width="24" height="7" rx="3.5" fill="#21E6A3"/>
      <rect x="139" y="84" width="10" height="47" rx="4" fill="#DCE4DE"/>
      <path d="M183 84h43l-5 75h-33l-5-75Z" fill="#F7FAF7" stroke="#DCE4DE"/>
      <path d="M186 113h37l-2 43h-33l-2-43Z" fill="#21E6A3" fill-opacity=".72"/>
      <path d="M195 95c4 7 11 8 17 2" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="2" stroke-linecap="round"/>
      <path d="M253 119h29v27c0 8-6 14-14 14s-15-6-15-14v-27Z" stroke="#AEB9B2" stroke-width="2"/>
      <path d="M253 130h29v16c0 8-6 14-14 14s-15-6-15-14v-16Z" fill="#08BFC5" fill-opacity=".2"/>
      <path d="M282 124c9 0 15 5 15 12s-6 11-15 11" stroke="#AEB9B2" stroke-width="2"/>
      <path d="M264 91c-6-10 5-14 0-24M278 91c-5-8 4-12 0-20" stroke="#21E6A3" stroke-opacity=".4" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="81" y="160" width="112" height="4" rx="2" fill="#CBD4CE"/>
      <rect x="81" y="169" width="76" height="3" rx="1.5" fill="#E2E8E4"/>
      <path d="M74 153h287" stroke="#CBD4CE"/>
      <circle cx="329" cy="146" r="4" fill="#21E6A3"/>
      <circle cx="343" cy="146" r="4" fill="#08BFC5" fill-opacity=".4"/>
    </svg>`,
    landing: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="103" y="44" width="258" height="158" rx="13" fill="#FFFFFF" fill-opacity=".35" stroke="#DDE4E0" transform="rotate(-4 232 123)"/>
      <rect x="87" y="33" width="272" height="164" rx="13" fill="#FFFFFF" stroke="#DFE5E1"/>
      <rect x="87" y="33" width="272" height="23" rx="13" fill="#F3F5F2"/>
      <circle cx="101" cy="44.5" r="2.3" fill="#C6CDC9"/><circle cx="109" cy="44.5" r="2.3" fill="#C6CDC9"/><circle cx="117" cy="44.5" r="2.3" fill="#C6CDC9"/>
      <rect x="103" y="72" width="92" height="7" rx="3.5" fill="#1B2026"/>
      <rect x="103" y="86" width="123" height="7" rx="3.5" fill="#1B2026"/>
      <rect x="103" y="106" width="146" height="4" rx="2" fill="#C9D0CC"/>
      <rect x="103" y="116" width="118" height="4" rx="2" fill="#DDE3DF"/>
      <rect x="103" y="137" width="83" height="27" rx="13.5" fill="#21E6A3"/>
      <rect x="119" y="148" width="50" height="5" rx="2.5" fill="#0B3B30"/>
      <rect x="265" y="75" width="72" height="108" rx="9" fill="#E4EAE5"/>
      <path d="M279 146c5-13 12-23 22-30 7 10 13 20 17 30" fill="#FFFFFF" fill-opacity=".65"/>
      <circle cx="293" cy="100" r="10" fill="#21E6A3" fill-opacity=".28"/>
      <path d="m350 153 17 7-8 4-3 9-6-20Z" fill="#12161C" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M54 78c11 0 19 4 25 12M52 97c8 0 14 3 18 8" stroke="#08BFC5" stroke-opacity=".35" stroke-linecap="round"/>
      <circle cx="364" cy="63" r="18" fill="#21E6A3" fill-opacity=".14"/>
      <path d="M356 63h16M364 55v16" stroke="#0A9E86" stroke-linecap="round"/>
      <rect x="55" y="138" width="89" height="29" rx="14.5" fill="#12161C"/>
      <rect x="70" y="150" width="44" height="4" rx="2" fill="#FFFFFF" fill-opacity=".6"/>
      <circle cx="128" cy="152" r="4" fill="#21E6A3"/>
    </svg>`,
    custom: `<svg viewBox="0 0 440 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="220" cy="110" r="77" stroke="#DCE4DF" stroke-dasharray="3 7"/>
      <circle cx="220" cy="110" r="52" stroke="#D6E1DB"/>
      <circle cx="220" cy="110" r="25" fill="#12161C"/>
      <circle cx="220" cy="110" r="17" fill="url(#customCenter)" opacity=".45"/>
      <circle cx="220" cy="110" r="7" fill="#21E6A3"/>
      <path d="M220 110 158 63M220 110l66-38M220 110l-8 72M220 110l75 33" stroke="#8CA79B" stroke-width="1.2" stroke-dasharray="2 4"/>
      <g fill="#FFFFFF" stroke="#DFE5E1">
        <rect x="117" y="42" width="74" height="40" rx="9"/>
        <rect x="269" y="52" width="74" height="40" rx="9"/>
        <rect x="195" y="168" width="72" height="36" rx="9"/>
        <rect x="284" y="129" width="68" height="37" rx="9"/>
      </g>
      <circle cx="133" cy="61" r="6" fill="#21E6A3" fill-opacity=".2"/><rect x="145" y="57" width="34" height="4" rx="2" fill="#1B2026"/><rect x="145" y="66" width="24" height="3" rx="1.5" fill="#C5CDC8"/>
      <circle cx="285" cy="71" r="6" fill="#08BFC5" fill-opacity=".2"/><rect x="297" y="67" width="34" height="4" rx="2" fill="#1B2026"/><rect x="297" y="76" width="22" height="3" rx="1.5" fill="#C5CDC8"/>
      <circle cx="211" cy="186" r="6" fill="#21E6A3" fill-opacity=".2"/><rect x="223" y="182" width="30" height="4" rx="2" fill="#1B2026"/><rect x="223" y="191" width="20" height="3" rx="1.5" fill="#C5CDC8"/>
      <circle cx="300" cy="147" r="6" fill="#08BFC5" fill-opacity=".2"/><rect x="312" y="143" width="25" height="4" rx="2" fill="#1B2026"/><rect x="312" y="152" width="18" height="3" rx="1.5" fill="#C5CDC8"/>
      <circle cx="158" cy="63" r="3" fill="#21E6A3"/><circle cx="286" cy="72" r="3" fill="#08BFC5"/><circle cx="212" cy="182" r="3" fill="#21E6A3"/><circle cx="300" cy="147" r="3" fill="#08BFC5"/>
      <path d="M356 34v17M347.5 42.5h17" stroke="#08BFC5" stroke-opacity=".35" stroke-linecap="round"/>
      <path d="M65 166v13M58.5 172.5h13" stroke="#21E6A3" stroke-opacity=".45" stroke-linecap="round"/>
      <defs>
        <radialGradient id="customCenter" cx="0" cy="0" r="1" gradientTransform="translate(220 110) rotate(90) scale(47)" gradientUnits="userSpaceOnUse">
          <stop stop-color="#21E6A3"/><stop offset="1" stop-color="#08BFC5" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>`
  };

  const setYear = () => {
    const year = String(new Date().getFullYear());
    const yearElement = qs("#year");
    const mobileYear = qs("#mobileMenuYear");
    if (yearElement) yearElement.textContent = year;
    if (mobileYear) mobileYear.textContent = year;
  };

  const renderServices = () => {
    const grid = qs("#servicesGrid");
    if (!grid) return;

    grid.innerHTML = CONFIG.services.map((service, index) => `
      <article class="service-card size-${escapeHTML(service.size)} reveal" style="--delay:${index * 55}ms">
        <div class="service-card__art">
          <span class="service-card__number">${escapeHTML(service.number)}</span>
          <span class="service-card__type">solution</span>
          <div class="service-art">${serviceArt[service.art] || ""}</div>
        </div>
        <div class="service-card__body">
          <h3>${escapeHTML(service.title)}</h3>
          <p>${escapeHTML(service.description)}</p>
          <div class="service-tags">${service.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
          <button class="service-link" type="button" data-open-order data-preselect="${escapeHTML(service.orderValue)}">
            <span class="service-link__text">Обсудить решение</span>
            <span class="service-link__icon">${icons.arrow}</span>
          </button>
        </div>
      </article>
    `).join("");
  };

  const renderPortfolio = () => {
    const grid = qs("#portfolioGrid");
    if (!grid) return;

    const projects = CONFIG.portfolio.filter((project) => !project.hidden);

    if (!projects.length) {
      grid.innerHTML = `<p class="portfolio-empty">Проекты появятся здесь. Добавьте их в config.js.</p>`;
      return;
    }

    grid.innerHTML = projects.map((project, index) => `
      <button class="portfolio-card reveal" type="button" data-concept="${escapeHTML(project.id)}" style="--delay:${index * 60}ms">
        <span class="portfolio-card__media">
          <img src="${escapeHTML(project.imageSmall)}" srcset="${escapeHTML(project.imageSmall)} 480w, ${escapeHTML(project.image)} 900w" sizes="(max-width: 700px) calc(100vw - 28px), (max-width: 960px) 50vw, 42vw" alt="${escapeHTML(project.alt)}" width="900" height="600" loading="lazy" decoding="async">
          <span class="portfolio-card__badge">Демо-концепт</span>
          <span class="portfolio-card__caption">${escapeHTML(project.category)} · ${escapeHTML(project.number)}</span>
          <span class="portfolio-card__open" aria-hidden="true">↗</span>
        </span>
        <span class="portfolio-card__body">
          <span class="portfolio-card__category">${escapeHTML(project.category)}</span>
          <strong>${escapeHTML(project.title)}</strong>
          <span>${escapeHTML(project.description)}</span>
        </span>
      </button>
    `).join("");
  };

  const renderAdvantages = () => {
    const grid = qs("#advantagesGrid");
    if (!grid) return;

    grid.innerHTML = CONFIG.advantages.map((advantage, index) => `
      <article class="adv-card reveal" style="--delay:${index * 55}ms">
        <div class="adv-card__top">
          <span class="adv-card__num">${escapeHTML(advantage.number)}</span>
          <span class="adv-card__icon">${icons[advantage.icon] || icons.spark}</span>
        </div>
        <h3>${escapeHTML(advantage.title)}</h3>
        <p>${escapeHTML(advantage.text)}</p>
      </article>
    `).join("");
  };

  const renderAbout = () => {
    const title = qs("#aboutTitle");
    const description = qs("#aboutDescription");
    const specialization = qs("#aboutSpecialization");
    const principles = qs("#aboutPrinciples");

    if (title && CONFIG.about.title) title.textContent = CONFIG.about.title;
    if (description && CONFIG.about.lead) description.textContent = CONFIG.about.lead;

    if (description && CONFIG.about.story) {
      const story = document.createElement("p");
      story.className = "about__description about__story";
      story.textContent = CONFIG.about.story;
      description.insertAdjacentElement("afterend", story);
    }

    const signature = qs(".about__signature");
    if (signature && CONFIG.about.founderName) {
      const name = qs("strong", signature);
      const role = qs("div span", signature);
      if (name) name.textContent = CONFIG.about.founderName;
      if (role && CONFIG.about.founderRole) role.textContent = CONFIG.about.founderRole;
    }

    if (specialization) {
      specialization.innerHTML = CONFIG.about.specialization
        .map((item) => `<span>${escapeHTML(item)}</span>`)
        .join("");
    }

    if (principles) {
      principles.innerHTML = CONFIG.about.principles.map((principle, index) => `
        <div class="principle reveal" style="--delay:${index * 60}ms">
          <span class="principle__num">0${index + 1}</span>
          <div>
            <strong>${escapeHTML(principle.title)}</strong>
            <p>${escapeHTML(principle.text)}</p>
          </div>
        </div>
      `).join("");
    }
  };

  const getWhatsAppNumber = () => {
    let digits = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("8")) {
      digits = `7${digits.slice(1)}`;
    }
    return digits;
  };

  const renderFooter = () => {
    const contacts = qs("#footerContacts");
    const socials = qs("#footerSocials");
    const contactItems = [];
    const number = getWhatsAppNumber();

    if (number.length >= 10) {
      contactItems.push(`
        <div class="footer-contact-item">
          <span>WhatsApp</span>
          <a href="https://wa.me/${number}" target="_blank" rel="noopener noreferrer">Написать в WhatsApp</a>
        </div>
      `);
    }

    if (CONFIG.contacts.phone) {
      contactItems.push(`
        <div class="footer-contact-item">
          <span>Телефон</span>
          <a href="tel:${escapeHTML(String(CONFIG.contacts.phone).replace(/[^\d+]/g, ""))}">${escapeHTML(CONFIG.contacts.phone)}</a>
        </div>
      `);
    }

    if (CONFIG.contacts.email) {
      contactItems.push(`
        <div class="footer-contact-item">
          <span>Email</span>
          <a href="mailto:${escapeHTML(CONFIG.contacts.email)}">${escapeHTML(CONFIG.contacts.email)}</a>
        </div>
      `);
    }

    if (CONFIG.contacts.address) {
      contactItems.push(`
        <div class="footer-contact-item">
          <span>Адрес</span>
          <span>${escapeHTML(CONFIG.contacts.address)}</span>
        </div>
      `);
    }

    if (CONFIG.contacts.workingHours) {
      contactItems.push(`
        <div class="footer-contact-item">
          <span>График</span>
          <span>${escapeHTML(CONFIG.contacts.workingHours)}</span>
        </div>
      `);
    }

    if (contacts) contacts.innerHTML = contactItems.join("");

    if (socials) {
      const socialLinks = CONFIG.socials.filter((social) => social.url);
      socials.innerHTML = socialLinks.map((social) => `
        <a class="footer__social" href="${escapeHTML(social.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(social.label)}">
          ${socialIcons[social.icon] || icons.arrow}
        </a>
      `).join("");
      socials.hidden = socialLinks.length === 0;
    }
  };

  const renderOrderChoices = () => {
    const services = qs("#serviceChoices");
    const deadlines = qs("#deadlineChoices");
    const venues = qs("#venueChoices");

    if (services) {
      services.innerHTML = CONFIG.orderServices.map((service) => `
        <label class="choice-card">
          <input type="checkbox" name="services" value="${escapeHTML(service)}">
          <span class="choice-card__check" aria-hidden="true"></span>
          <span class="choice-card__title">${escapeHTML(service)}</span>
        </label>
      `).join("");
    }

    if (deadlines) {
      deadlines.innerHTML = Object.entries(CONFIG.pricing).map(([key, option]) => {
        const price = formatPrice(option.price);
        return `
          <label class="choice-card choice-card--deadline">
            <input type="radio" name="deadline" value="${escapeHTML(key)}">
            <span class="choice-card__check" aria-hidden="true"></span>
            <span class="deadline-label">${escapeHTML(option.label)}</span>
            <span class="deadline-name">${escapeHTML(option.name)}</span>
            <span class="deadline-desc">${escapeHTML(option.description)}</span>
            ${price ? `<span class="deadline-price">${escapeHTML(price)}</span>` : ""}
            <span class="deadline-hint">${escapeHTML(option.hint)}</span>
          </label>
        `;
      }).join("");
    }

    if (venues) {
      venues.innerHTML = CONFIG.venueTypes.map((venue) => `
        <label class="choice-chip">
          <input type="radio" name="venue" value="${escapeHTML(venue)}">
          <span>${escapeHTML(venue)}</span>
        </label>
      `).join("");
    }
  };

  const renderShowcasePhone = () => {
    const screen = qs("#showcasePhone");
    if (!screen) return;

    const menu = CONFIG.demoMenu;
    const categories = menu.categories.filter((category) => category.id !== "all");
    const items = menu.items;
    const menuLabel = items.length ? items[0].category : "";

    screen.innerHTML = `
      <div class="showcase-phone__head">
        <img src="${escapeHTML(menu.cover)}" alt="Интерьер заведения — демонстрационное меню" width="900" height="600" loading="lazy" decoding="async">
        <div class="showcase-phone__head-info">
          <span>${escapeHTML(menu.venueLabel)}</span>
          <strong>${escapeHTML(menu.venueName)}</strong>
        </div>
      </div>
      <div class="showcase-phone__body">
        <div class="showcase-phone__label"><span>Меню</span><strong>${menu.items.length} позиций</strong></div>
        <div class="showcase-chips">
          ${categories.map((category) => `<span class="${category.id === menuLabel ? "is-active" : ""}">${escapeHTML(category.label)}</span>`).join("")}
        </div>
        ${items.map((item, index) => `
          <div class="showcase-dish${index > 3 ? " is-extra" : ""}">
            <img src="${escapeHTML(item.image)}" alt="" width="480" height="480" loading="lazy" decoding="async">
            <div><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.description)}</span></div>
            <em>${escapeHTML(item.price)}</em>
          </div>
        `).join("")}
        <div class="showcase-phone__footer"><span>Демо-интерфейс</span><span>Открыть меню ↗</span></div>
      </div>
    `;
  };

  const renderDemoTabs = (activeCategory = "all") => {
    const tabs = qs("#demoTabs");
    if (!tabs) return;

    tabs.innerHTML = CONFIG.demoMenu.categories.map((category) => `
      <button class="demo-tab ${category.id === activeCategory ? "is-active" : ""}" type="button" role="tab" aria-selected="${category.id === activeCategory}" tabindex="${category.id === activeCategory ? "0" : "-1"}" data-category="${escapeHTML(category.id)}">${escapeHTML(category.label)}</button>
    `).join("");
  };

  const renderDemoList = (activeCategory = "all") => {
    const list = qs("#demoMenuList");
    if (!list) return;

    const categoryMap = Object.fromEntries(CONFIG.demoMenu.categories.map((category) => [category.id, category.label]));
    const items = activeCategory === "all"
      ? CONFIG.demoMenu.items
      : CONFIG.demoMenu.items.filter((item) => item.category === activeCategory);

    list.innerHTML = items.map((item) => `
      <article class="demo-dish">
        <div class="demo-dish__image">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" width="480" height="480" loading="lazy" decoding="async">
          ${item.badge ? `<span class="demo-dish__badge">${escapeHTML(item.badge)}</span>` : ""}
        </div>
        <div class="demo-dish__body">
          <span class="demo-dish__category">${escapeHTML(categoryMap[item.category] || "")}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description)}</p>
          <span class="demo-dish__price">${escapeHTML(item.price)}</span>
        </div>
      </article>
    `).join("");
  };

  const setupDemoMenu = () => {
    const modal = qs("#demoMenuModal");
    const tabs = qs("#demoTabs");
    const venueName = qs("#demoVenueName");
    const cover = qs("#demoCoverImage");
    if (!modal) return;

    if (venueName) venueName.textContent = CONFIG.demoMenu.venueName;
    if (cover) cover.src = CONFIG.demoMenu.cover;
    renderDemoTabs();
    renderDemoList();

    if (tabs) {
      tabs.addEventListener("click", (event) => {
        const tab = event.target.closest(".demo-tab");
        if (!tab) return;
        const category = tab.dataset.category || "all";
        renderDemoTabs(category);
        renderDemoList(category);
        const activeTab = qs(`.demo-tab[data-category="${category}"]`, tabs);
        if (activeTab) activeTab.focus({ preventScroll: true });
      });

      tabs.addEventListener("keydown", (event) => {
        if (!["ArrowRight", "ArrowLeft"].includes(event.key)) return;
        const tabsList = qsa(".demo-tab", tabs);
        const currentIndex = tabsList.indexOf(document.activeElement);
        if (currentIndex === -1) return;
        event.preventDefault();
        const nextIndex = event.key === "ArrowRight"
          ? (currentIndex + 1) % tabsList.length
          : (currentIndex - 1 + tabsList.length) % tabsList.length;
        tabsList[nextIndex].click();
      });
    }
  };

  const resetDemo = () => {
    renderDemoTabs("all");
    renderDemoList("all");
    const scroll = qs("#demoScroll");
    if (scroll) scroll.scrollTop = 0;
  };

  let activeModal = null;
  let lastFocused = null;

  const getFocusable = (container) => qsa(
    'a[href], button:not([disabled]):not([hidden]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    container
  ).filter((element) => element.offsetParent !== null && window.getComputedStyle(element).visibility !== "hidden");

  const openModal = (modal, focusTarget) => {
    if (!modal) return;
    if (activeModal && activeModal !== modal) {
      closeModal(activeModal, false);
    }
    lastFocused = document.activeElement;
    activeModal = modal;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    window.setTimeout(() => {
      const target = focusTarget || qs(".modal-close", modal) || qs(".demo-tab", modal) || modal;
      if (target && typeof target.focus === "function") {
        target.focus({ preventScroll: true });
      }
    }, 80);
  };

  const closeModal = (modal = activeModal, restoreFocus = true) => {
    if (!modal || modal !== activeModal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    activeModal = null;
    if (!document.body.classList.contains("menu-open")) {
      document.body.classList.remove("is-locked");
    }
    if (restoreFocus && lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  };

  const openOrder = (preselect = "") => {
    const modal = qs("#orderModal");
    if (!modal) return;

    if (document.body.classList.contains("menu-open")) {
      closeMobileMenu(false);
    }

    if (preselect && CONFIG.orderServices.includes(preselect)) {
      state.services.clear();
      state.services.add(preselect);
    }

    syncFormUI();

    const firstHeading = qs('.order-step[data-step="1"] h3');
    goToStep(1, false);
    openModal(modal, firstHeading);
  };

  const openDemo = () => {
    resetDemo();
    openModal(qs("#demoMenuModal"), qs(".modal-close", qs("#demoMenuModal")));
  };

  const openConcept = (id) => {
    const project = CONFIG.portfolio.find((item) => item.id === id);
    if (!project) return;

    qs("#conceptNumber").textContent = project.number;
    qs("#conceptCategory").textContent = project.category;
    qs("#conceptTitle").textContent = project.title;
    qs("#conceptDescription").textContent = project.description;
    qs("#conceptTags").innerHTML = project.tags.map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");

    const image = qs("#conceptImage");
    image.src = project.image;
    image.alt = project.alt;

    qs("#conceptOrder").dataset.preselect = project.service || "";

    openModal(qs("#conceptModal"), qs(".modal-close", qs("#conceptModal")));
  };

  const syncFormUI = () => {
    qsa('input[name="services"]', qs("#serviceChoices")).forEach((input) => {
      input.checked = state.services.has(input.value);
      input.closest(".choice-card").classList.toggle("is-selected", input.checked);
    });

    const otherField = qs("#otherServiceField");
    if (otherField) otherField.hidden = !state.services.has("Другое");

    qsa('input[name="venue"]', qs("#venueChoices")).forEach((input) => {
      input.checked = state.venueType === input.value;
      input.closest(".choice-chip").classList.toggle("is-selected", input.checked);
    });

    qsa('input[name="deadline"]', qs("#deadlineChoices")).forEach((input) => {
      input.checked = state.deadline === input.value;
      input.closest(".choice-card").classList.toggle("is-selected", input.checked);
    });

    qsa('input[name="photos"]').forEach((input) => {
      input.checked = state.photos === input.value;
      input.closest(".choice-card").classList.toggle("is-selected", input.checked);
    });

    const otherService = qs("#otherService");
    const venueOther = qs("#venueOther");
    const clientName = qs("#clientName");
    const projectDetails = qs("#projectDetails");
    const wishes = qs("#wishes");

    if (otherService) otherService.value = state.otherService;
    if (venueOther) {
      venueOther.value = state.venueOther;
      venueOther.hidden = state.venueType !== "Другое";
    }
    if (clientName) clientName.value = state.details.name;
    if (projectDetails) projectDetails.value = state.details.description;
    if (wishes) wishes.value = state.details.wishes;

    qs("#step1Error").textContent = "";
    qs("#step2Error").textContent = "";
    qs("#step3Error").textContent = "";
    qs("#step5Error").textContent = "";
  };

  const getVenueValue = () => {
    if (state.venueType !== "Другое") return state.venueType;
    return state.venueOther ? `Другое — ${state.venueOther}` : "Другое";
  };

  const getDeadlineValue = () => {
    const option = CONFIG.pricing[state.deadline];
    if (!option) return "";
    const price = formatPrice(option.price);
    return `${option.label} · ${option.name}${price ? ` · ${price}` : ""}`;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      "Здравствуйте! Хочу обсудить проект в alirzaev-it.",
      "",
      `Услуги: ${Array.from(state.services).join(", ")}`
    ];

    const venue = getVenueValue();
    if (venue) lines.push(`Тип заведения: ${venue}`);
    if (state.services.has("Другое") && state.otherService.trim()) {
      lines.push(`Описание задачи: ${state.otherService.trim()}`);
    }

    const deadline = CONFIG.pricing[state.deadline];
    if (deadline) {
      const price = formatPrice(deadline.price);
      lines.push(`Срок: ${deadline.label} — ${deadline.name}${price ? ` (${price})` : ""}`);
    }

    if (state.photos) lines.push(`Фотографии: ${state.photos}`);
    if (state.details.name.trim()) lines.push(`Имя: ${state.details.name.trim()}`);
    if (state.details.description.trim()) lines.push(`Описание проекта: ${state.details.description.trim()}`);
    if (state.details.wishes.trim()) lines.push(`Пожелания: ${state.details.wishes.trim()}`);

    lines.push("", "Заявка сформирована на сайте alirzaev-it.");
    return lines.join("\n");
  };

  const validateStep = (step) => {
    if (step === 1) {
      const error = qs("#step1Error");
      if (!state.services.size) {
        error.textContent = "Выберите хотя бы одну услугу, чтобы продолжить.";
        const firstInput = qs('input[name="services"]');
        if (firstInput) firstInput.focus({ preventScroll: false });
        return false;
      }
      if (state.services.has("Другое") && !state.otherService.trim()) {
        error.textContent = "Опишите задачу для варианта «Другое».";
        const other = qs("#otherService");
        if (other) other.focus({ preventScroll: false });
        return false;
      }
      error.textContent = "";
      return true;
    }

    if (step === 2) {
      const error = qs("#step2Error");
      if (!state.deadline) {
        error.textContent = "Выберите один из сроков.";
        return false;
      }
      error.textContent = "";
      return true;
    }

    if (step === 3) {
      const error = qs("#step3Error");
      if (!state.photos) {
        error.textContent = "Укажите, есть ли у вас фотографии.";
        return false;
      }
      error.textContent = "";
      return true;
    }

    return true;
  };

  const updateStepUI = () => {
    const progress = Math.round((state.step / totalSteps) * 100);
    const indicator = qs("#orderStepIndicator");
    const progressBar = qs("#orderProgressBar");
    const asideProgress = qs("#orderAsideProgress");
    const progressValue = qs("#orderProgressValue");
    const prevButton = qs("#prevStep");
    const nextButton = qs("#nextStep");
    const submitButton = qs("#submitOrder");
    const configNote = qs("#orderConfigNote");

    if (indicator) indicator.textContent = `Шаг ${state.step} из ${totalSteps}`;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (asideProgress) asideProgress.style.width = `${progress}%`;
    if (progressValue) progressValue.textContent = `${progress}%`;

    qsa("#orderSteps li").forEach((item) => {
      const step = Number(item.dataset.stepLabel);
      item.classList.toggle("is-active", step === state.step);
      item.classList.toggle("is-complete", step < state.step);
    });

    qsa(".order-step", qs("#orderStepPanels")).forEach((panel) => {
      const isActive = Number(panel.dataset.step) === state.step;
      panel.classList.toggle("is-active", isActive);
      panel.setAttribute("aria-hidden", String(!isActive));
    });

    if (prevButton) prevButton.hidden = state.step === 1;
    if (nextButton) {
      nextButton.hidden = state.step === totalSteps;
      const label = qs("span", nextButton);
      if (label) label.textContent = state.step === 4 ? "Проверить заявку" : "Далее";
    }
    if (submitButton) submitButton.hidden = state.step !== totalSteps;

    const whatsappReady = getWhatsAppNumber().length >= 10;
    const submitLabel = submitButton ? qs("span", submitButton) : null;
    if (submitLabel) submitLabel.textContent = whatsappReady ? "Отправить заказ в WhatsApp" : "Сформировать текст заявки";

    if (configNote) configNote.hidden = true;

    const sendNote = qs(".order-send-note");
    if (sendNote) sendNote.hidden = false;

    const sendNoteText = qs("#orderSendNoteText");
    if (sendNoteText) {
      sendNoteText.textContent = whatsappReady
        ? "После нажатия кнопки откроется WhatsApp с готовым сообщением. Заявка не отправляется автоматически — подтвердите отправку в WhatsApp."
        : "WhatsApp пока не настроен. Добавьте номер в config.js — после этого кнопка откроет чат с готовой заявкой. Сейчас текст заявки можно сформировать и скопировать.";
    }

    if (state.step === totalSteps) renderReview();

    const panels = qs("#orderStepPanels");
    if (panels) panels.scrollTop = 0;
  };

  const goToStep = (step, animateFocus = true) => {
    const next = Math.max(1, Math.min(totalSteps, step));
    state.step = next;
    updateStepUI();

    if (animateFocus) {
      window.setTimeout(() => {
        const heading = qs(`.order-step[data-step="${next}"] h3`);
        if (heading) heading.focus({ preventScroll: true });
      }, 80);
    }
  };

  const renderReview = () => {
    const review = qs("#orderReview");
    if (!review) return;

    const services = Array.from(state.services);
    const venue = getVenueValue();
    const deadline = getDeadlineValue();
    const details = [
      { label: "Имя", value: state.details.name },
      { label: "Описание проекта", value: state.details.description },
      { label: "Пожелания", value: state.details.wishes }
    ];

    review.innerHTML = `
      <div class="order-review__group">
        <div class="order-review__group-top">
          <span>Услуги</span>
          <button class="order-review__edit" type="button" data-go-step="1">Изменить</button>
        </div>
        <div class="order-review__chips">${services.map((service) => `<span>${escapeHTML(service)}</span>`).join("")}</div>
        ${state.services.has("Другое") && state.otherService.trim() ? `<div class="order-review__value" style="margin-top:9px">${nl2br(state.otherService.trim())}</div>` : ""}
      </div>
      <div class="order-review__group">
        <div class="order-review__group-top">
          <span>Тип заведения</span>
          <button class="order-review__edit" type="button" data-go-step="1">Изменить</button>
        </div>
        <div class="order-review__value ${venue ? "" : "is-empty"}">${venue ? escapeHTML(venue) : "Не указано"}</div>
      </div>
      <div class="order-review__group">
        <div class="order-review__group-top">
          <span>Срок</span>
          <button class="order-review__edit" type="button" data-go-step="2">Изменить</button>
        </div>
        <div class="order-review__value">${escapeHTML(deadline)}</div>
      </div>
      <div class="order-review__group">
        <div class="order-review__group-top">
          <span>Фотографии</span>
          <button class="order-review__edit" type="button" data-go-step="3">Изменить</button>
        </div>
        <div class="order-review__value">${escapeHTML(state.photos)}</div>
      </div>
      <div class="order-review__group">
        <div class="order-review__group-top">
          <span>Детали</span>
          <button class="order-review__edit" type="button" data-go-step="4">Изменить</button>
        </div>
        ${details.map((item) => `
          <div class="order-review__detail">
            <span>${escapeHTML(item.label)}</span>
            <div class="order-review__value ${item.value.trim() ? "" : "is-empty"}">${item.value.trim() ? nl2br(item.value.trim()) : "Не заполнено"}</div>
          </div>
        `).join("")}
      </div>
    `;

    const configNote = qs("#orderConfigNote");
    if (configNote) {
      configNote.hidden = true;
      configNote.innerHTML = "";
    }
  };

  const showConfigNote = (message) => {
    const note = qs("#orderConfigNote");
    if (!note) return;

    note.innerHTML = `
      <strong>WhatsApp пока не настроен</strong>
      Добавьте номер телефона в файл <code>config.js</code> в поле <code>whatsappNumber</code>. После этого кнопка будет открывать WhatsApp с готовым сообщением. Сейчас отправка через WhatsApp недоступна — текст заявки можно скопировать и отправить вручную.
      <button class="copy-message" type="button">Скопировать текст заявки</button>
    `;
    note.hidden = false;

    const sendNote = qs(".order-send-note");
    if (sendNote) sendNote.hidden = true;

    const copyButton = qs(".copy-message", note);
    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const copied = await copyText(message);
        showToast(copied ? "Текст заявки скопирован" : "Не удалось скопировать текст");
      });
    }

    note.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (copyError) {
        copied = false;
      }
      textarea.remove();
      return copied;
    }
  };

  const submitOrder = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      goToStep(1);
      return;
    }

    const message = buildWhatsAppMessage();
    state.lastMessage = message;
    const number = getWhatsAppNumber();

    if (number.length < 10) {
      showConfigNote(message);
      showToast("Добавьте номер WhatsApp в config.js");
      return;
    }

    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("Открываем WhatsApp — подтвердите отправку в чате");
  };

  const setupForm = () => {
    const form = qs("#orderForm");
    if (!form) return;

    qs("#serviceChoices").addEventListener("change", (event) => {
      const input = event.target;
      if (!input.matches('input[name="services"]')) return;
      state.services = new Set(qsa('input[name="services"]:checked', qs("#serviceChoices")).map((item) => item.value));
      input.closest(".choice-card").classList.toggle("is-selected", input.checked);
      qs("#otherServiceField").hidden = !state.services.has("Другое");
      qs("#step1Error").textContent = "";
    });

    qs("#deadlineChoices").addEventListener("change", (event) => {
      const input = event.target;
      if (!input.matches('input[name="deadline"]')) return;
      state.deadline = input.value;
      qsa('input[name="deadline"]').forEach((item) => {
        item.closest(".choice-card").classList.toggle("is-selected", item.checked);
      });
      qs("#step2Error").textContent = "";
    });

    qsa('input[name="photos"]').forEach((input) => {
      input.addEventListener("change", () => {
        state.photos = input.value;
        qsa('input[name="photos"]').forEach((item) => {
          item.closest(".choice-card").classList.toggle("is-selected", item.checked);
        });
        qs("#step3Error").textContent = "";
      });
    });

    qs("#venueChoices").addEventListener("change", (event) => {
      const input = event.target;
      if (!input.matches('input[name="venue"]')) return;
      state.venueType = input.value;
      qsa('input[name="venue"]').forEach((item) => {
        item.closest(".choice-chip").classList.toggle("is-selected", item.checked);
      });
      qs("#venueOther").hidden = state.venueType !== "Другое";
      if (state.venueType === "Другое") qs("#venueOther").focus();
    });

    const otherService = qs("#otherService");
    if (otherService) {
      otherService.addEventListener("input", () => {
        state.otherService = otherService.value;
        qs("#step1Error").textContent = "";
      });
    }

    const venueOther = qs("#venueOther");
    if (venueOther) {
      venueOther.addEventListener("input", () => {
        state.venueOther = venueOther.value;
      });
    }

    const clientName = qs("#clientName");
    const projectDetails = qs("#projectDetails");
    const wishes = qs("#wishes");

    if (clientName) clientName.addEventListener("input", () => { state.details.name = clientName.value; });
    if (projectDetails) projectDetails.addEventListener("input", () => { state.details.description = projectDetails.value; });
    if (wishes) wishes.addEventListener("input", () => { state.details.wishes = wishes.value; });

    qs("#nextStep").addEventListener("click", () => {
      if (!validateStep(state.step)) return;
      goToStep(state.step + 1);
    });

    qs("#prevStep").addEventListener("click", () => {
      goToStep(state.step - 1);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (state.step === totalSteps) submitOrder();
    });

    qs("#orderStepPanels").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-go-step]");
      if (!edit) return;
      goToStep(Number(edit.dataset.goStep));
    });

    qs("#conceptOrder").addEventListener("click", () => {
      const preselect = qs("#conceptOrder").dataset.preselect || "";
      closeModal(qs("#conceptModal"), false);
      openOrder(preselect);
    });

    document.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open-order]");
      if (opener) {
        event.preventDefault();
        openOrder(opener.dataset.preselect || "");
      }

      if (event.target.closest("[data-close-order]")) closeModal(qs("#orderModal"));
      if (event.target.closest("[data-close-demo]")) closeModal(qs("#demoMenuModal"));
      if (event.target.closest("[data-close-concept]")) closeModal(qs("#conceptModal"));

      const demoTrigger = event.target.closest("[data-open-demo]");
      if (demoTrigger) {
        event.preventDefault();
        openDemo();
      }

      const conceptCard = event.target.closest("[data-concept]");
      if (conceptCard) {
        openConcept(conceptCard.dataset.concept);
      }
    });
  };

  let toastTimer = null;
  const showToast = (message) => {
    const toast = qs("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  };

  const setupModalKeyboard = () => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && activeModal) {
        closeModal(activeModal);
        return;
      }

      if (event.key !== "Tab" || !activeModal) return;
      const focusable = getFocusable(activeModal);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  };

  const intro = qs("#intro");

  const completeIntro = (animate = true) => {
    root.classList.add("is-ready");
    document.body.classList.remove("is-intro");
    if (!intro) return;

    if (!animate) {
      intro.remove();
      return;
    }

    intro.classList.add("is-done");
    intro.setAttribute("aria-hidden", "true");
    window.setTimeout(() => intro.remove(), 1100);
  };

  const setupIntro = () => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("alirzaev-intro-seen") === "1";
    } catch (error) {
      seen = false;
    }

    if (!intro || reducedMotion || seen) {
      completeIntro(false);
    } else {
      document.body.classList.add("is-intro");
      const timer = window.setTimeout(() => {
        try { sessionStorage.setItem("alirzaev-intro-seen", "1"); } catch (error) {}
        completeIntro(true);
      }, 1850);

      const skip = qs("#introSkip");
      if (skip) {
        skip.addEventListener("click", () => {
          window.clearTimeout(timer);
          try { sessionStorage.setItem("alirzaev-intro-seen", "1"); } catch (error) {}
          completeIntro(true);
        });
      }
    }
  };

  const revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" })
    : null;

  const observeReveals = (scope = document) => {
    qsa(".reveal", scope).forEach((element) => {
      if (reducedMotion || !revealObserver) {
        element.classList.add("is-visible");
      } else {
        revealObserver.observe(element);
      }
    });
  };

  const setupParallax = () => {
    const stage = qs("#heroStage");
    if (!stage || !finePointer || reducedMotion) return;

    const layers = qsa("[data-depth]", stage);
    if (!layers.length) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = null;

    const render = () => {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth) || 0.1;
        layer.style.setProperty("--px", `${(currentX * depth * 90).toFixed(2)}px`);
        layer.style.setProperty("--py", `${(currentY * depth * 90).toFixed(2)}px`);
      });

      if (Math.abs(currentX - targetX) > 0.001 || Math.abs(currentY - targetY) > 0.001) {
        frame = window.requestAnimationFrame(render);
      } else {
        frame = null;
      }
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    stage.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - 0.5;
      targetY = (event.clientY - rect.top) / rect.height - 0.5;
      start();
    });

    stage.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      start();
    });
  };

  const setupHeader = () => {
    const header = qs("#siteHeader");
    const progress = qs("#scrollProgress");
    if (!header) return;

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

      header.classList.toggle("is-scrolled", scrollTop > 24);
      if (progress) progress.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  };

  const setupActiveNavigation = () => {
    const links = qsa(".nav-link");
    if (!links.length) return;

    const sections = ["home", "solutions", "work", "about", "contacts"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.05, 0.2, 0.45], rootMargin: "-30% 0px -50% 0px" });

    sections.forEach((section) => observer.observe(section));
  };

  let menuFocus = null;

  const openMobileMenu = () => {
    const menu = qs("#mobileMenu");
    const toggle = qs("#menuToggle");
    if (!menu || !toggle) return;
    menuFocus = document.activeElement;
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Закрыть меню");
    document.body.classList.add("menu-open");
    window.setTimeout(() => {
      const firstLink = qs(".mobile-nav a", menu);
      if (firstLink) firstLink.focus({ preventScroll: true });
    }, 180);
  };

  const closeMobileMenu = (restoreFocus = true) => {
    const menu = qs("#mobileMenu");
    const toggle = qs("#menuToggle");
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("menu-open");
    if (!activeModal) document.body.classList.remove("is-locked");
    if (restoreFocus && menuFocus && typeof menuFocus.focus === "function") {
      menuFocus.focus({ preventScroll: true });
    }
  };

  const setupMobileMenu = () => {
    const toggle = qs("#menuToggle");
    const menu = qs("#mobileMenu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      if (menu.classList.contains("is-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    qsa("a", menu).forEach((link) => {
      link.addEventListener("click", () => closeMobileMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("is-open") && !activeModal) {
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab" || !menu.classList.contains("is-open") || activeModal) return;
      const focusable = getFocusable(menu);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    const desktopQuery = window.matchMedia("(min-width: 961px)");
    const handleChange = (event) => {
      if (event.matches && menu.classList.contains("is-open")) closeMobileMenu(false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", handleChange);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(handleChange);
    }
  };

  const setupAnchors = () => {
    qsa('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const isMobileMenuOpen = document.body.classList.contains("menu-open");
        if (isMobileMenuOpen) closeMobileMenu(false);

        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        if (history.replaceState) history.replaceState(null, "", href);
      });
    });
  };

  const setupVisibility = () => {
    document.addEventListener("visibilitychange", () => {
      document.body.classList.toggle("is-paused", document.hidden);
    });
  };

  const init = () => {
    setYear();
    renderServices();
    renderPortfolio();
    renderAdvantages();
    renderAbout();
    renderFooter();
    renderOrderChoices();
    renderShowcasePhone();
    setupDemoMenu();

    setupIntro();
    setupHeader();
    setupActiveNavigation();
    setupMobileMenu();
    setupAnchors();
    setupForm();
    setupModalKeyboard();
    setupParallax();
    setupVisibility();

    syncFormUI();
    observeReveals();
    updateStepUI();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
