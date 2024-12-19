import React from 'react';

const blueMarketplace = '#329CC7';

// This is Facebook's logo, you are not allowed to change its color
export const FacebookLogo = (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.89.214C4.055 1.047 1.005 4.13.205 7.947c-.734 3.45.533 7.283 3.166 9.6.967.85 3.2 2.033 4.15 2.183l.617.1v-6.883H5.806v-3h2.283l.083-1.633c.134-2.417.717-3.534 2.3-4.25.617-.284 1.034-.35 2.3-.334.85.017 1.617.084 1.7.134.1.05.167.7.167 1.433v1.317h-.983c-1.484 0-1.75.283-1.817 1.983l-.067 1.35h1.45c1.284 0 1.434.033 1.35.283-.05.167-.133.667-.2 1.134-.216 1.55-.25 1.583-1.483 1.583h-1.083V19.914l.866-.234c1.684-.433 2.984-1.216 4.4-2.633 2.067-2.067 2.9-4.1 2.9-7.017 0-3.166-1.2-5.75-3.616-7.766C14.106.38 10.772-.42 7.889.214z"
      fill="#1877F2"
      fillRule="nonzero"
    />
  </svg>
);

// This is Google's logo, you are not allowed to change its color
export const GoogleLogo = (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path
        d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.192 5.736 7.396 3.977 10 3.977z"
        fill="#EA4335"
      />
      <path d="M0 0h20v20H0z" />
    </g>
  </svg>
);

export const GoogleCalendarLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
    <path fill="#FFF" d="M195.368 60.632H60.632v134.736h134.736z" />
    <path fill="#EA4335" d="M195.368 256L256 195.368l-30.316-5.172l-30.316 5.172l-5.533 27.73z" />
    <path
      fill="#188038"
      d="M0 195.368v40.421C0 246.956 9.044 256 20.21 256h40.422l6.225-30.316l-6.225-30.316l-33.033-5.172L0 195.368Z"
    />
    <path
      fill="#1967D2"
      d="M256 60.632V20.21C256 9.044 246.956 0 235.79 0h-40.422c-3.688 15.036-5.533 26.101-5.533 33.196c0 7.094 1.845 16.24 5.533 27.436c13.41 3.84 23.515 5.76 30.316 5.76c6.801 0 16.906-1.92 30.316-5.76Z"
    />
    <path fill="#FBBC04" d="M256 60.632h-60.632v134.736H256z" />
    <path fill="#34A853" d="M195.368 195.368H60.632V256h134.736z" />
    <path
      fill="#4285F4"
      d="M195.368 0H20.211C9.044 0 0 9.044 0 20.21v175.158h60.632V60.632h134.736V0Z"
    />
    <path
      fill="#4285F4"
      d="M88.27 165.154c-5.036-3.402-8.523-8.37-10.426-14.94l11.689-4.816c1.06 4.042 2.913 7.175 5.558 9.398c2.627 2.223 5.827 3.318 9.566 3.318c3.823 0 7.107-1.162 9.852-3.487c2.746-2.324 4.127-5.288 4.127-8.875c0-3.672-1.449-6.67-4.345-8.994c-2.897-2.324-6.535-3.486-10.88-3.486h-6.754v-11.57h6.063c3.739 0 6.888-1.011 9.448-3.033c2.56-2.02 3.84-4.783 3.84-8.303c0-3.132-1.145-5.625-3.435-7.494c-2.29-1.87-5.188-2.813-8.708-2.813c-3.436 0-6.164.91-8.185 2.745a16.115 16.115 0 0 0-4.413 6.754l-11.57-4.817c1.532-4.345 4.345-8.185 8.471-11.503c4.127-3.318 9.398-4.985 15.798-4.985c4.733 0 8.994.91 12.767 2.745c3.772 1.836 6.736 4.379 8.875 7.613c2.14 3.25 3.2 6.888 3.2 10.93c0 4.126-.993 7.613-2.98 10.476c-1.988 2.863-4.43 5.052-7.327 6.585v.69a22.248 22.248 0 0 1 9.398 7.327c2.442 3.284 3.672 7.208 3.672 11.79c0 4.58-1.163 8.673-3.487 12.26c-2.324 3.588-5.54 6.417-9.617 8.472c-4.092 2.055-8.69 3.1-13.793 3.1c-5.912.016-11.369-1.685-16.405-5.087Zm71.797-58.005l-12.833 9.28l-6.417-9.734l23.023-16.607h8.825v78.333h-12.598V107.15Z"
    />
  </svg>
);

export const AppleLogo = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="grey"
      d="M17.458 12.625A4.523 4.523 0 0 1 19.62 8.82a4.672 4.672 0 0 0-3.658-1.984c-1.558-.158-3.04.917-3.829.917c-.79 0-2.009-.894-3.3-.87a4.896 4.896 0 0 0-4.14 2.508c-1.762 3.06-.449 7.593 1.268 10.076c.84 1.214 1.843 2.581 3.158 2.532c1.268-.05 1.746-.82 3.277-.82c1.531 0 1.962.82 3.3.795c1.364-.025 2.229-1.239 3.062-2.457a10.946 10.946 0 0 0 1.385-2.845a4.42 4.42 0 0 1-2.685-4.047Zm-2.517-7.432A4.405 4.405 0 0 0 15.981 2a4.483 4.483 0 0 0-2.945 1.516a4.186 4.186 0 0 0-1.061 3.093a3.71 3.71 0 0 0 2.966-1.416Z"
    />
  </svg>
);

export const BandCampLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2365 4494 c-16 -2 -73 -9 -125 -15 -333 -38 -682 -181 -965 -398
-85 -64 -256 -232 -328 -321 -189 -235 -339 -545 -397 -825 -48 -232 -58 -506
-26 -719 65 -433 256 -814 564 -1122 295 -295 653 -481 1068 -556 184 -33 513
-33 689 0 203 38 358 90 540 179 478 237 844 660 1011 1170 132 402 128 862
-11 1263 -245 706 -851 1212 -1590 1325 -99 15 -372 27 -430 19z m455 -1622
c0 -104 3 -192 6 -195 4 -4 23 8 42 25 72 63 161 87 257 69 169 -31 272 -160
291 -363 19 -210 -76 -402 -223 -452 -111 -38 -260 -11 -330 58 l-42 42 -3
-45 -3 -46 -80 0 -80 0 -5 539 -5 538 -292 -538 -291 -539 -637 -3 c-566 -2
-637 0 -631 13 6 16 519 966 563 1043 l24 42 719 0 720 0 0 -188z m1206 -123
c100 -38 184 -145 184 -236 0 -22 -3 -23 -80 -23 l-80 0 -15 38 c-42 100 -149
139 -251 93 -86 -39 -130 -145 -122 -290 10 -166 78 -251 201 -251 82 0 141
47 172 136 l13 39 81 3 c92 3 92 3 67 -82 -48 -158 -179 -244 -360 -234 -213
11 -346 167 -346 405 0 229 107 384 293 423 62 13 177 3 243 -21z"
      />
      <path
        d="M2968 2631 c-50 -16 -87 -51 -115 -109 -25 -51 -28 -67 -28 -162 0
-95 3 -110 28 -163 41 -84 88 -112 182 -112 61 0 78 4 112 27 136 90 133 394
-5 492 -45 32 -122 43 -174 27z"
      />
    </g>
  </svg>
);

export const InstagramLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 800.000000 800.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,800.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M3730 6974 c-25 -3 -106 -13 -180 -25 -628 -93 -1206 -386 -1660
-839 -453 -453 -729 -998 -841 -1660 -21 -121 -23 -167 -23 -450 0 -282 2
-329 23 -450 118 -702 425 -1275 936 -1749 360 -334 846 -593 1326 -705 257
-61 349 -70 689 -70 280 0 330 2 450 22 546 92 1031 307 1430 636 584 481 949
1116 1070 1862 27 166 38 545 21 727 -54 578 -274 1125 -634 1581 -103 130
-353 381 -485 484 -345 273 -777 480 -1197 574 -224 50 -320 60 -605 63 -151
1 -295 1 -320 -1z m1325 -1029 c235 -41 412 -131 578 -294 128 -125 211 -255
266 -419 61 -184 61 -176 61 -1195 0 -929 -4 -1052 -36 -1182 -49 -197 -151
-372 -297 -512 -166 -158 -353 -251 -583 -288 -136 -22 -1963 -22 -2096 0
-464 76 -817 431 -893 897 -22 138 -22 1958 0 2096 38 234 133 421 299 588
170 171 348 265 582 308 117 21 2001 22 2119 1z"
      />
      <path
        d="M2975 5609 c-287 -49 -535 -299 -585 -589 -8 -46 -10 -362 -8 -1060
l3 -995 27 -78 c87 -257 311 -453 568 -497 46 -8 362 -10 1060 -8 l995 3 69
23 c234 80 401 245 483 477 l28 80 0 1030 0 1030 -23 70 c-78 242 -247 413
-492 498 l-65 22 -1005 1 c-553 1 -1027 -2 -1055 -7z m2168 -310 c21 -6 56
-27 78 -46 58 -52 81 -104 82 -179 2 -223 -270 -324 -415 -154 -156 182 21
444 255 379z m-953 -319 c372 -78 662 -342 765 -697 102 -352 7 -723 -254
-984 -447 -447 -1183 -369 -1536 161 -119 179 -180 430 -157 639 27 234 121
436 279 598 238 242 582 350 903 283z"
      />
      <path
        d="M3839 4641 c-464 -119 -652 -678 -354 -1053 188 -237 528 -315 800
-183 383 186 495 674 230 1007 -156 197 -435 291 -676 229z"
      />
    </g>
  </svg>
);

export const ItunesLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2355 4494 c-16 -2 -73 -9 -125 -15 -120 -14 -336 -69 -454 -115
-632 -251 -1096 -797 -1231 -1452 -174 -836 202 -1687 938 -2127 283 -169 599
-260 942 -272 345 -12 631 47 933 192 420 203 733 515 937 936 193 398 246
837 155 1274 -41 201 -142 455 -250 630 -329 535 -895 886 -1520 944 -109 10
-258 12 -325 5z m982 -888 l28 -24 3 -739 c2 -471 -1 -766 -7 -817 -15 -108
-56 -189 -137 -266 -73 -70 -145 -106 -243 -120 -214 -30 -390 101 -391 291 0
82 21 145 67 199 58 67 98 86 304 139 146 38 198 56 212 72 15 19 17 50 17
324 l0 303 -31 26 c-17 14 -35 26 -40 26 -27 0 -896 -173 -912 -182 -10 -5
-27 -24 -37 -41 -19 -31 -20 -55 -20 -532 0 -533 -2 -549 -51 -652 -33 -70
-126 -158 -202 -194 -196 -91 -403 -41 -491 121 -73 133 -25 312 104 392 29
18 110 45 233 76 136 35 194 55 210 71 l22 22 5 618 c5 600 6 620 25 641 11
12 28 26 39 32 22 12 1187 236 1233 237 20 1 42 -8 60 -23z"
      />
    </g>
  </svg>
);

export const SoundCloudLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2305 4473 c-277 -32 -493 -95 -708 -205 -541 -277 -918 -770 -1043
-1368 -75 -359 -46 -745 83 -1090 289 -773 1035 -1290 1863 -1290 530 0 1054
224 1420 607 391 409 587 946 549 1509 -17 260 -80 499 -193 729 -110 225
-230 389 -408 560 -384 371 -860 559 -1397 554 -75 -1 -149 -4 -166 -6z m701
-1411 c156 -57 263 -152 335 -297 22 -44 45 -108 51 -143 11 -61 13 -63 37
-58 149 35 276 -2 364 -105 56 -65 79 -138 75 -234 -7 -161 -108 -280 -266
-314 -77 -16 -1014 -15 -1030 1 -19 19 -17 1121 2 1137 7 6 47 20 87 31 107
29 235 22 345 -18z m-496 -52 c29 -18 38 -1001 10 -1076 -8 -20 -16 -25 -38
-22 -26 3 -27 6 -34 78 -16 176 -4 994 15 1018 11 14 26 15 47 2z m-111 -74
c14 -16 21 -967 8 -1003 -10 -28 -37 -37 -55 -20 -22 23 -30 264 -21 663 4
194 10 358 14 364 9 14 41 12 54 -4z m-347 -141 c11 -101 14 -738 5 -817 -8
-65 -21 -84 -45 -69 -24 14 -34 294 -23 626 6 174 13 320 17 326 3 6 13 9 22
7 13 -2 19 -20 24 -73z m113 43 c13 -59 23 -624 13 -764 -10 -158 -22 -195
-53 -164 -23 24 -32 270 -23 616 5 170 10 315 13 322 8 21 44 14 50 -10z
m-231 -10 c3 -13 9 -160 14 -328 10 -323 0 -566 -26 -592 -25 -25 -35 10 -45
159 -10 157 2 748 16 771 13 20 36 14 41 -10z m346 -3 c10 -12 13 -115 14
-456 1 -425 0 -441 -18 -455 -27 -19 -33 -18 -48 9 -18 31 -16 881 2 902 16
19 34 19 50 0z m-458 -130 c11 -157 14 -580 5 -688 -7 -71 -13 -100 -23 -104
-8 -3 -18 -2 -22 2 -17 17 -27 322 -19 580 9 305 11 318 35 313 14 -3 18 -20
24 -103z m-104 -220 c11 -167 11 -245 2 -380 -12 -167 -21 -208 -44 -185 -22
22 -32 297 -20 542 6 128 12 234 13 236 0 2 9 2 19 0 15 -3 19 -27 30 -213z
m-223 -103 c14 -134 14 -169 1 -297 -8 -80 -18 -150 -21 -156 -17 -26 -28 17
-39 154 -10 115 -10 176 -1 295 7 83 16 156 20 162 16 26 26 -12 40 -158z
m-111 -5 c14 -135 14 -162 0 -290 -8 -77 -18 -145 -21 -150 -14 -22 -23 19
-35 150 -9 113 -9 173 1 290 7 81 15 151 18 156 13 22 23 -18 37 -156z m223
-4 c11 -108 11 -165 3 -263 -14 -168 -18 -190 -35 -190 -19 0 -22 19 -33 180
-9 137 4 391 22 418 18 28 29 -10 43 -145z m-332 -20 c14 -113 14 -133 0 -245
-9 -68 -18 -124 -20 -126 -13 -14 -23 22 -34 131 -11 98 -11 146 -1 233 20
187 31 188 55 7z m-106 -55 c11 -88 -3 -223 -24 -223 -17 0 -32 148 -23 222
17 123 31 123 47 1z"
      />
    </g>
  </svg>
);

export const SpotifyIconLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2305 4489 c-599 -61 -1133 -383 -1467 -884 -399 -598 -445 -1361
-121 -1998 109 -214 226 -371 406 -543 290 -279 658 -464 1052 -531 156 -26
507 -25 655 1 493 87 935 353 1242 746 165 213 290 466 359 730 38 147 51 247
56 431 8 272 -18 454 -97 693 -250 746 -920 1278 -1709 1356 -117 11 -259 11
-376 -1z m345 -1014 c431 -53 836 -167 1150 -325 87 -44 146 -103 156 -157 17
-89 -27 -181 -106 -220 -72 -37 -103 -31 -278 51 -461 218 -975 318 -1522 294
-190 -8 -352 -28 -580 -74 -242 -49 -289 -40 -336 61 -40 85 -27 186 31 241
26 24 54 36 122 53 119 29 353 67 493 80 63 6 133 13 155 15 99 10 588 -3 715
-19z m-209 -645 c401 -40 795 -160 1104 -337 121 -69 162 -151 119 -236 -56
-110 -139 -134 -254 -72 -240 130 -388 190 -585 239 -218 55 -408 76 -674 76
-209 0 -388 -18 -566 -56 -176 -38 -195 -39 -244 -14 -55 27 -86 91 -78 158 6
54 31 90 85 120 67 37 343 96 587 125 69 9 411 6 506 -3z m184 -679 c224 -40
434 -107 640 -206 118 -57 179 -106 190 -154 13 -58 -58 -151 -126 -166 -26
-6 -54 5 -177 68 -303 155 -603 227 -950 227 -162 0 -298 -14 -527 -56 -82
-14 -164 -29 -181 -31 -43 -7 -101 23 -121 61 -34 65 -10 163 44 184 40 16
328 70 463 87 176 22 588 14 745 -14z"
      />
    </g>
  </svg>
);

export const WebsiteIconLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2305 4489 c-374 -36 -774 -200 -1065 -439 -505 -413 -784 -1059
-731 -1698 51 -632 373 -1177 901 -1525 353 -233 815 -353 1228 -319 180 15
327 44 490 98 599 197 1069 667 1266 1266 138 417 138 839 0 1256 -290 883
-1159 1449 -2089 1361z m368 -750 c373 -56 688 -262 888 -579 290 -460 242
-1070 -116 -1477 -261 -297 -610 -447 -999 -430 -195 9 -324 41 -491 122 -297
144 -539 418 -643 730 -45 132 -57 222 -57 405 1 155 4 187 27 280 125 496
515 859 1018 945 94 16 279 18 373 4z"
      />
      <path
        d="M2358 3554 c-58 -44 -129 -137 -173 -230 -28 -56 -105 -270 -105
-290 0 -2 79 -4 175 -4 l175 0 0 280 c0 217 -3 280 -12 280 -7 0 -34 -16 -60
-36z"
      />
      <path
        d="M2570 3310 l0 -280 175 0 c96 0 175 2 175 4 0 3 -16 53 -35 113 -63
193 -151 339 -245 408 -26 19 -53 35 -59 35 -8 0 -11 -81 -11 -280z"
      />
      <path
        d="M2058 3516 c-129 -56 -226 -123 -334 -231 -84 -82 -194 -224 -194
-249 0 -4 91 -5 202 -4 l201 3 8 25 c60 207 128 372 185 447 41 54 36 55 -68
9z"
      />
      <path
        d="M2850 3546 c0 -3 12 -22 26 -43 64 -92 124 -237 183 -443 l8 -25 201
-3 c111 -1 202 0 202 4 0 3 -20 37 -45 74 -54 85 -177 215 -264 281 -83 62
-311 176 -311 155z"
      />
      <path
        d="M1440 2823 c-38 -125 -53 -238 -47 -368 5 -109 28 -234 56 -307 l11
-28 223 0 223 0 -8 53 c-23 157 -18 610 8 700 5 16 -10 17 -220 17 l-225 0
-21 -67z"
      />
      <path
        d="M2046 2853 c-33 -204 -33 -544 0 -705 l6 -28 189 0 189 0 0 385 0
385 -189 0 -189 0 -6 -37z"
      />
      <path
        d="M2570 2505 l0 -385 189 0 c221 0 193 -22 212 170 13 138 7 398 -12
523 l-11 77 -189 0 -189 0 0 -385z"
      />
      <path
        d="M3094 2873 c26 -90 31 -543 8 -700 l-8 -53 223 0 223 0 11 28 c27 71
50 198 55 307 7 130 -7 242 -46 368 l-21 67 -225 0 c-210 0 -225 -1 -220 -17z"
      />
      <path
        d="M1540 1942 c73 -130 238 -299 372 -381 83 -51 226 -116 235 -107 3 2
-6 20 -20 38 -57 76 -132 249 -171 398 l-23 85 -207 3 -208 2 22 -38z"
      />
      <path
        d="M2080 1971 c0 -6 16 -58 35 -118 63 -193 151 -339 245 -408 26 -19
53 -35 59 -35 8 0 11 82 11 285 l0 285 -175 0 c-103 0 -175 -4 -175 -9z"
      />
      <path
        d="M2570 1695 c0 -157 4 -285 8 -285 5 0 30 14 56 31 93 62 187 215 251
412 19 60 35 112 35 118 0 5 -72 9 -175 9 l-175 0 0 -285z"
      />
      <path
        d="M3065 1968 c-2 -7 -11 -41 -20 -76 -34 -133 -106 -303 -170 -396 -14
-21 -24 -40 -21 -43 8 -9 153 58 234 108 133 82 299 252 372 380 l21 39 -206
0 c-155 0 -207 -3 -210 -12z"
      />
    </g>
  </svg>
);

export const TidalIconLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="34"
    viewBox="0 0 500.000000 500.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill={blueMarketplace}
      stroke="none"
    >
      <path
        d="M2260 4483 c-19 -2 -89 -15 -155 -28 -439 -89 -846 -328 -1126 -664
-151 -180 -273 -389 -352 -601 -143 -384 -161 -831 -48 -1231 134 -475 447
-893 863 -1151 597 -370 1344 -402 1966 -83 624 320 1035 942 1081 1639 42
624 -209 1232 -674 1633 -305 263 -642 419 -1032 478 -96 14 -423 19 -523 8z
m-313 -1545 l183 -183 183 183 c100 100 187 182 192 182 5 0 92 -82 192 -182
l183 -183 56 55 c30 30 113 113 182 183 70 70 132 126 139 125 7 -2 96 -86
198 -187 l186 -185 -188 -188 c-103 -103 -191 -188 -194 -188 -4 0 -88 81
-188 180 -100 99 -185 180 -189 180 -4 0 -88 -81 -187 -180 l-179 -179 182
-184 c100 -100 182 -187 182 -192 0 -6 -84 -95 -188 -198 l-187 -187 -193 193
-192 192 180 180 c99 99 180 187 180 195 0 8 -80 95 -178 193 l-178 178 -182
-186 c-100 -102 -186 -185 -190 -185 -4 0 -92 85 -195 188 l-188 189 188 186
c103 103 192 187 198 187 5 0 92 -82 192 -182z"
      />
    </g>
  </svg>
);

// export const VerifiedIconLogo = (
//   <svg
//     version="1.0"
//     xmlns="http://www.w3.org/2000/svg"
//     width="34"
//     height="34"
//     viewBox="0 0 300.000000 300.000000"
//     preserveAspectRatio="xMidYMid meet"
//   >
//     <g
//       transform="translate(0.000000,300.000000) scale(0.100000,-0.100000)"
//       fill={blueMarketplace}
//       stroke="red"
//     >
//       <path
//         d="M1095 2781 c-77 -19 -131 -88 -171 -220 -31 -106 -53 -158 -71 -173
// -10 -8 -66 -13 -161 -15 -195 -3 -251 -24 -293 -110 -28 -58 -23 -148 16 -253
// 15 -41 32 -96 37 -123 13 -57 8 -64 -93 -133 -157 -106 -205 -172 -197 -270 6
// -71 42 -122 133 -191 39 -29 91 -68 117 -88 27 -19 48 -43 48 -54 0 -10 -16
// -67 -35 -127 -73 -226 -54 -319 75 -377 37 -16 69 -21 175 -22 72 -2 140 -3
// 153 -4 31 -1 67 -65 87 -151 15 -70 66 -168 107 -207 35 -33 99 -56 137 -48
// 77 15 116 35 206 107 33 26 78 57 99 67 36 19 39 19 70 3 17 -10 69 -46 115
// -80 104 -78 141 -94 212 -95 104 -1 164 61 213 220 33 108 55 160 73 175 9 7
// 69 12 161 14 194 4 252 26 292 108 33 69 21 180 -33 306 -8 19 -18 56 -22 82
// l-7 46 49 37 c26 20 80 60 118 88 39 29 85 75 103 102 31 46 34 55 30 112 -5
// 80 -37 128 -133 200 -39 29 -91 68 -117 88 -29 21 -48 43 -48 55 0 11 16 71
// 36 132 72 221 53 313 -75 370 -36 17 -70 20 -194 22 -178 3 -170 -2 -215 139
// -60 182 -104 245 -188 266 -81 21 -156 -10 -294 -121 -20 -15 -53 -37 -74 -48
// -37 -18 -40 -19 -70 -2 -16 9 -62 41 -100 71 -118 89 -199 120 -271 102z m130
// -45 c28 -13 82 -47 120 -76 39 -30 90 -61 115 -71 46 -17 46 -17 102 10 31 16
// 64 36 73 45 36 36 136 96 177 107 24 7 60 9 79 5 70 -13 137 -104 167 -226 16
// -65 48 -133 73 -156 18 -16 42 -20 173 -25 128 -4 159 -8 196 -27 100 -49 118
// -135 62 -299 -17 -50 -34 -114 -38 -142 -6 -48 -5 -51 32 -88 22 -21 62 -53
// 89 -72 76 -52 152 -135 166 -181 24 -81 -31 -168 -162 -256 -38 -26 -83 -63
// -100 -82 -29 -32 -31 -39 -25 -84 4 -27 20 -84 36 -128 54 -146 50 -218 -14
// -281 -47 -45 -101 -59 -239 -59 -152 0 -178 -10 -211 -82 -14 -29 -35 -87 -47
// -128 -28 -94 -60 -145 -107 -173 -79 -47 -143 -31 -287 73 -46 33 -100 67
// -121 76 -35 14 -39 14 -88 -10 -28 -14 -69 -40 -91 -58 -146 -122 -245 -140
// -322 -58 -30 31 -84 146 -108 227 -10 34 -30 77 -45 95 l-28 33 -158 6 c-158
// 6 -190 12 -230 46 -57 50 -72 114 -48 211 9 37 19 72 23 77 3 6 6 12 7 15 0 3
// 8 29 17 59 33 106 20 132 -112 225 -91 63 -156 133 -165 177 -13 65 4 109 63
// 169 31 31 86 78 123 103 36 26 76 59 88 74 27 35 24 76 -18 198 -54 160 -51
// 226 13 288 45 44 105 57 254 57 165 0 173 6 226 165 53 159 82 204 155 237 31
// 14 86 7 135 -16z"
//       />
//       <path
//         d="M1799 1717 c-19 -13 -89 -64 -154 -113 -137 -101 -124 -91 -193 -144
// -63 -49 -74 -47 -133 18 -24 26 -66 66 -93 90 -43 37 -56 42 -97 42 -82 0
// -134 -68 -114 -147 7 -29 220 -254 288 -303 65 -48 138 -25 268 85 20 16 67
// 52 105 79 148 107 285 219 299 246 26 49 19 94 -19 134 -29 31 -40 36 -78 36
// -31 0 -56 -7 -79 -23z m142 -26 c30 -31 38 -75 19 -110 -5 -10 -131 -109 -279
// -221 -237 -177 -275 -202 -307 -202 -34 0 -48 11 -186 149 -82 81 -151 158
// -154 171 -8 29 13 78 40 97 11 8 36 15 56 15 32 0 46 -11 140 -105 58 -58 108
// -105 112 -105 5 0 110 77 235 170 253 190 268 197 324 141z"
//       />
//     </g>
//   </svg>
// );

export const DiscordIconLogo = (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 920.000000 902.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,902.000000) scale(0.100000,-0.100000)"
      fill="#000000"
      stroke="none"
    ></g>
  </svg>
);