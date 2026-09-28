// --- I18N (English / Thai) ---
// Stored data keeps English keys (types, statuses, locations); they are translated
// only when rendered. Static markup uses data-i18n / data-i18n-placeholder /
// data-i18n-title / data-i18n-aria attributes; dynamic markup calls t().
const LANG_KEY = 'sdc_lang';

const I18N = {
    en: {
        // Pages & navigation
        'page.dashboard': 'Traffic Monitoring Dashboard',
        'page.camera': 'Camera Monitor',
        'page.alerts': 'Alert Center',
        'page.incidents': 'Incidents',
        'page.map': 'Risk Map',
        'page.stats': 'Statistics',
        'page.settings': 'Settings',
        'nav.dashboard': 'Dashboard',
        'nav.camera': 'Camera Monitor',
        'nav.alerts': 'Alert Center',
        'nav.incidents': 'Incidents',
        'nav.map': 'Risk Map',
        'nav.stats': 'Statistics',
        'nav.settings': 'Settings',
        'sidebar.collapse': 'Collapse the SDC System bar',
        'sidebar.expand': 'Expand the SDC System bar',
        'sidebar.open': 'Open menu',
        'topbar.demoMode': 'DEMO MODE',
        'lang.switch': 'Language',
        'footer.text': 'A prototype system that helps officers manage traffic safety on campus',

        // Common
        'common.view': 'View',
        'common.open': 'Open',
        'common.map': 'Map',
        'common.new': 'NEW',
        'common.on': 'ON',
        'common.off': 'OFF',
        'unit.kmh': 'km/h',

        // Incident types
        'type.Speeding': 'Speeding',
        'type.Pedestrian Violation': 'Pedestrian Violation',
        'type.Illegal Parking': 'Illegal Parking',
        'type.Wrong-way': 'Wrong-way',
        'type.No Helmet': 'No Helmet',
        'type.No License Plate': 'No License Plate',
        'type.Possible Accident': 'Possible Accident',
        'type.Normal': 'Normal',
        'typeShort.Speeding': 'Speeding',
        'typeShort.Pedestrian Violation': 'Pedestrian',
        'typeShort.Illegal Parking': 'Parking',
        'typeShort.Wrong-way': 'Wrong-way',
        'typeShort.No Helmet': 'No Helmet',
        'typeShort.No License Plate': 'No Plate',
        'typeShort.Possible Accident': 'Accident',
        'typeShort.Normal': 'Normal',

        // Statuses
        'status.Pending': 'Pending',
        'status.Reviewed': 'Reviewed',
        'status.Verified': 'Verified',
        'status.Responding': 'Responding',
        'status.Action Taken': 'Action Taken',
        'status.Closed': 'Closed',
        'status.Dismissed': 'Dismissed',

        // Locations
        'loc.Gate 1': 'Gate 1',
        'loc.Gate 2': 'Gate 2',
        'loc.Crosswalk A': 'Crosswalk A',
        'loc.Building A': 'Building A',
        'loc.Building B': 'Building B',

        // Risk
        'risk.High': 'High',
        'risk.Medium': 'Medium',
        'risk.Low': 'Low',

        // Roles
        'role.officer': 'Traffic Safety Officer',
        'role.admin': 'System Administrator',

        // Table columns
        'col.id': 'ID',
        'col.date': 'Date',
        'col.time': 'Time',
        'col.dateTime': 'Date / Time',
        'col.type': 'Type',
        'col.location': 'Location',
        'col.camera': 'Camera',
        'col.locCam': 'Location / Camera',
        'col.plate': 'Plate',
        'col.details': 'Details',
        'col.conf': 'Confidence',
        'col.status': 'Status',
        'col.action': 'Action',
        'col.speed': 'Speed (km/h)',
        'col.limit': 'Limit (km/h)',

        // Plates
        'plate.none': 'No plate detected',
        'plate.na': '—',

        // Login
        'login.title': 'Sign in',
        'login.subtitle': 'Sign in to monitor traffic safety across the campus.',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.showPassword': 'Show password',
        'login.hidePassword': 'Hide password',
        'login.remember': 'Remember me on this device',
        'login.submit': 'Log In',
        'login.signingIn': 'Signing in…',
        'login.demoAccounts': 'Demo accounts — click to fill',
        'login.footnote': 'Simulated login: credentials are checked in the browser only.',
        'login.errEmpty': 'Please enter your email and password.',
        'login.errEmail': 'Please enter a valid email address.',
        'login.errWrong': 'Incorrect email or password.',
        'login.loggedOut': "You've been logged out. Log back in to continue monitoring SMART DRIVE CAMPUS.",

        // Notifications
        'notif.title': 'Notifications',
        'notif.clear': 'Clear',
        'notif.empty': 'No new notifications',
        'notif.new': 'New {type} detected at {loc}',
        'notif.markRead': 'Mark as read',

        // Demo panel
        'demo.title': 'Simulation Controls',
        'demo.desc': 'Generates events on random online cameras.',
        'demo.simulate': 'Simulate {type}',
        'demo.auto': 'Auto-generate',
        'demo.every': 'every {n} s',

        // Dashboard
        'dash.today': 'Today',
        'dash.todayEvents': "Today's Events",
        'dash.new': 'New Events',
        'dash.reviewing': 'Under Review',
        'dash.actionTaken': 'Action Taken',
        'dash.cameras': 'Cameras Online',
        'dash.recent': 'Recent Alerts',
        'dash.openCamera': 'Open Camera',
        'dash.viewAlerts': 'View Open Alerts',
        'dash.viewMap': 'View Risk Map',
        'dash.topRisk': 'Top Risk Locations',
        'dash.eventsCount': '{n} events',
        'dash.noIncidents': 'No incidents recorded yet.',

        // Camera
        'cam.title': 'Live Camera Monitor',
        'cam.onlineBadge': '{online}/{total} ONLINE',
        'cam.online': '● Online',
        'cam.offline': '● Offline',
        'cam.awaiting': 'Awaiting detection…',
        'cam.last': 'Last:',
        'cam.speedLimit': '{speed} km/h · LIMIT {limit}',

        // Alert Center
        'alerts.title': 'Alert Center',
        'alerts.subtitle': 'Open alerts that still need action.',
        'alerts.all': 'All Alerts',
        'alerts.conf': 'Conf {n}%',
        'alerts.speed': 'Speed {speed}/{limit} km/h',
        'alerts.plate': 'Plate {plate}',
        'alerts.review': 'Review',
        'alerts.markRead': 'Mark Read',
        'alerts.empty': 'No open alerts. All caught up!',

        // Incidents
        'inc.title': 'Incident Database',
        'inc.allStatus': 'All Status',
        'inc.search': 'Search ID, plate, location, camera…',
        'inc.export': 'Export CSV',
        'inc.empty': 'No incidents match your filters.',
        'inc.back': '← Back to List',
        'inc.incident': 'Incident',
        'inc.evidence': 'Evidence',
        'inc.details': 'Details',
        'inc.speedLimit': 'Speed / Limit',
        'inc.timeline': 'Status Timeline',
        'inc.notes': 'Notes',
        'inc.notePlaceholder': 'Add a note about this incident…',
        'inc.addNote': 'Add Note',
        'inc.noNotes': 'No notes yet.',

        // Timeline
        'tl.detected': 'System detected {type} with {conf}% confidence.',
        'tl.reviewed': 'Officer reviewed the footage.',
        'tl.verified': 'Officer verified the accident.',
        'tl.actionTaken': 'Action taken against the violation.',
        'tl.responding': 'Response unit dispatched.',
        'tl.closed': 'Case closed.',
        'tl.skipped': 'Skipped.',
        'tl.falseAlarm': 'Marked as a false alarm.',
        'tl.dismissed': 'Dismissed after review.',
        'tl.system': 'System',

        // Incident actions
        'act.verify': 'Verify Accident',
        'act.falseAlarm': 'False Alarm',
        'act.dispatch': 'Dispatch Unit',
        'act.close': 'Close Case',
        'act.review': 'Mark Reviewed',
        'act.takeAction': 'Take Action',
        'act.dismiss': 'Dismiss',

        // Map
        'map.title': 'Campus Risk Map',
        'map.desc': 'Distribution of all recorded safety incidents across campus zones.',
        'map.low': 'Low (<5)',
        'map.med': 'Medium (5–10)',
        'map.high': 'High (>10)',
        'map.events': 'Events',
        'map.risk': 'Risk',
        'map.viewIncidents': 'View Incidents',

        // Statistics
        'stats.title': 'Traffic Statistics',
        'stats.allTime': 'All Time',
        'stats.today': 'Today',
        'stats.last7': 'Last 7 Days',
        'stats.allTypes': 'All Types',
        'stats.allDay': 'All Day',
        'stats.morning': 'Morning (06–12)',
        'stats.afternoon': 'Afternoon (12–18)',
        'stats.evening': 'Evening (18–06)',
        'stats.byType': 'Violations by Type',
        'stats.byLoc': 'Events by Location',
        'stats.byHour': 'Event Timeline (by Hour)',
        'stats.events': 'Events',
        'stats.kpiEvents': 'Events (Filtered)',
        'stats.kpiAccidents': 'Possible Accidents',
        'stats.kpiTopLoc': 'Top Location',
        'stats.kpiBusiest': 'Busiest Hour',

        // Settings
        'set.title': 'System Settings',
        'set.officer': 'Officer Information',
        'set.name': 'Name',
        'set.email': 'Email',
        'set.role': 'Role',
        'set.prefs': 'Preferences',
        'set.language': 'Language',
        'set.sound': 'Alert Sound',
        'set.soundDesc': 'Play a beep when a new event is detected.',
        'set.demoMode': 'Demo Mode',
        'set.data': 'Data Management',
        'set.dataDesc': 'Resetting data will clear all current incidents and reload the demo dataset.',
        'set.reset': 'Reset Demo Data',
        'set.adminOnly': 'Only administrators can reset data.',
        'set.confirmReset': 'Are you sure you want to reset all data?',
        'set.resetDone': 'Data reset successful.',
        'set.system': 'System Info',
        'set.version': 'Version',
        'set.versionValue': 'v1.1.0 (Prototype)',
        'set.storage': 'Storage',
        'set.auth': 'Authentication',
        'set.authValue': 'Simulated (client-side)',
        'set.theme': 'UI Theme',
        'set.themeValue': 'Light Modern',
        'set.session': 'Session',
        'set.sessionDesc': 'Sign out of the SDC System.',
        'set.logout': 'Logout',
        'set.confirmLogout': 'Are you sure you want to logout?',

        // Errors
        'error.loadTitle': "Couldn't load the pages",
        'error.loadBody': 'Open this project through a local web server (for example VS Code Live Server or "npx serve") instead of opening index.html directly.'
    },

    th: {
        'page.dashboard': 'แดชบอร์ดติดตามการจราจร',
        'page.camera': 'กล้องวงจรปิด',
        'page.alerts': 'ศูนย์แจ้งเตือน',
        'page.incidents': 'เหตุการณ์',
        'page.map': 'แผนที่ความเสี่ยง',
        'page.stats': 'สถิติ',
        'page.settings': 'ตั้งค่า',
        'nav.dashboard': 'แดชบอร์ด',
        'nav.camera': 'กล้องวงจรปิด',
        'nav.alerts': 'ศูนย์แจ้งเตือน',
        'nav.incidents': 'เหตุการณ์',
        'nav.map': 'แผนที่ความเสี่ยง',
        'nav.stats': 'สถิติ',
        'nav.settings': 'ตั้งค่า',
        'sidebar.collapse': 'ย่อแถบ SDC System',
        'sidebar.expand': 'ขยายแถบ SDC System',
        'sidebar.open': 'เปิดเมนู',
        'topbar.demoMode': 'โหมดสาธิต',
        'lang.switch': 'ภาษา',
        'footer.text': 'ระบบต้นแบบเพื่อช่วยเจ้าหน้าที่จัดการความปลอดภัยด้านการจราจรภายในมหาวิทยาลัย',

        'common.view': 'ดู',
        'common.open': 'เปิด',
        'common.map': 'แผนที่',
        'common.new': 'ใหม่',
        'common.on': 'เปิด',
        'common.off': 'ปิด',
        'unit.kmh': 'กม./ชม.',

        'type.Speeding': 'ขับรถเร็วเกินกำหนด',
        'type.Pedestrian Violation': 'ฝ่าฝืนกฎทางม้าลาย',
        'type.Illegal Parking': 'จอดรถในที่ห้ามจอด',
        'type.Wrong-way': 'ขับรถย้อนศร',
        'type.No Helmet': 'ไม่สวมหมวกกันน็อก',
        'type.No License Plate': 'ไม่มีป้ายทะเบียน',
        'type.Possible Accident': 'อาจเกิดอุบัติเหตุ',
        'type.Normal': 'ปกติ',
        'typeShort.Speeding': 'ขับเร็ว',
        'typeShort.Pedestrian Violation': 'ทางม้าลาย',
        'typeShort.Illegal Parking': 'จอดผิดที่',
        'typeShort.Wrong-way': 'ย้อนศร',
        'typeShort.No Helmet': 'ไม่สวมหมวก',
        'typeShort.No License Plate': 'ไม่มีป้าย',
        'typeShort.Possible Accident': 'อุบัติเหตุ',
        'typeShort.Normal': 'ปกติ',

        'status.Pending': 'รอดำเนินการ',
        'status.Reviewed': 'ตรวจสอบแล้ว',
        'status.Verified': 'ยืนยันแล้ว',
        'status.Responding': 'กำลังเข้าช่วยเหลือ',
        'status.Action Taken': 'ดำเนินการแล้ว',
        'status.Closed': 'ปิดเคส',
        'status.Dismissed': 'ยกเลิกแล้ว',

        'loc.Gate 1': 'ประตู 1',
        'loc.Gate 2': 'ประตู 2',
        'loc.Crosswalk A': 'ทางม้าลาย A',
        'loc.Building A': 'อาคาร A',
        'loc.Building B': 'อาคาร B',

        'risk.High': 'สูง',
        'risk.Medium': 'ปานกลาง',
        'risk.Low': 'ต่ำ',

        'role.officer': 'เจ้าหน้าที่ความปลอดภัยด้านการจราจร',
        'role.admin': 'ผู้ดูแลระบบ',

        'col.id': 'รหัส',
        'col.date': 'วันที่',
        'col.time': 'เวลา',
        'col.dateTime': 'วันที่ / เวลา',
        'col.type': 'ประเภท',
        'col.location': 'สถานที่',
        'col.camera': 'กล้อง',
        'col.locCam': 'สถานที่ / กล้อง',
        'col.plate': 'ทะเบียน',
        'col.details': 'รายละเอียด',
        'col.conf': 'ความมั่นใจ',
        'col.status': 'สถานะ',
        'col.action': 'จัดการ',
        'col.speed': 'ความเร็ว (กม./ชม.)',
        'col.limit': 'ความเร็วจำกัด (กม./ชม.)',

        'plate.none': 'ไม่พบป้ายทะเบียน',
        'plate.na': '—',

        'login.title': 'เข้าสู่ระบบ',
        'login.subtitle': 'เข้าสู่ระบบเพื่อติดตามความปลอดภัยด้านการจราจรภายในมหาวิทยาลัย',
        'login.email': 'อีเมล',
        'login.password': 'รหัสผ่าน',
        'login.showPassword': 'แสดงรหัสผ่าน',
        'login.hidePassword': 'ซ่อนรหัสผ่าน',
        'login.remember': 'จดจำการเข้าสู่ระบบบนอุปกรณ์นี้',
        'login.submit': 'เข้าสู่ระบบ',
        'login.signingIn': 'กำลังเข้าสู่ระบบ…',
        'login.demoAccounts': 'บัญชีทดลอง — คลิกเพื่อกรอกอัตโนมัติ',
        'login.footnote': 'ระบบจำลอง: ตรวจสอบอีเมลและรหัสผ่านภายในเบราว์เซอร์เท่านั้น',
        'login.errEmpty': 'กรุณากรอกอีเมลและรหัสผ่าน',
        'login.errEmail': 'รูปแบบอีเมลไม่ถูกต้อง',
        'login.errWrong': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        'login.loggedOut': 'ออกจากระบบแล้ว เข้าสู่ระบบอีกครั้งเพื่อติดตาม SMART DRIVE CAMPUS ต่อ',

        'notif.title': 'การแจ้งเตือน',
        'notif.clear': 'ล้าง',
        'notif.empty': 'ไม่มีการแจ้งเตือนใหม่',
        'notif.new': 'แจ้งเตือนใหม่: {type} ที่ {loc}',
        'notif.markRead': 'ทำเครื่องหมายว่าอ่านแล้ว',

        'demo.title': 'ควบคุมการจำลอง',
        'demo.desc': 'สร้างเหตุการณ์บนกล้องที่ออนไลน์แบบสุ่ม',
        'demo.simulate': 'จำลอง: {type}',
        'demo.auto': 'สร้างอัตโนมัติ',
        'demo.every': 'ทุก {n} วินาที',

        'dash.today': 'วันนี้',
        'dash.todayEvents': 'เหตุการณ์วันนี้',
        'dash.new': 'เหตุการณ์ใหม่',
        'dash.reviewing': 'รอตรวจสอบ',
        'dash.actionTaken': 'ดำเนินการแล้ว',
        'dash.cameras': 'กล้องออนไลน์',
        'dash.recent': 'การแจ้งเตือนล่าสุด',
        'dash.openCamera': 'เปิดกล้อง',
        'dash.viewAlerts': 'ดูการแจ้งเตือนที่ค้างอยู่',
        'dash.viewMap': 'ดูแผนที่ความเสี่ยง',
        'dash.topRisk': 'จุดเสี่ยงสูงสุด',
        'dash.eventsCount': '{n} เหตุการณ์',
        'dash.noIncidents': 'ยังไม่มีเหตุการณ์ที่บันทึกไว้',

        'cam.title': 'กล้องวงจรปิดสด',
        'cam.onlineBadge': 'ออนไลน์ {online}/{total}',
        'cam.online': '● ออนไลน์',
        'cam.offline': '● ออฟไลน์',
        'cam.awaiting': 'รอการตรวจจับ…',
        'cam.last': 'ล่าสุด:',
        'cam.speedLimit': '{speed} กม./ชม. · จำกัด {limit}',

        'alerts.title': 'ศูนย์แจ้งเตือน',
        'alerts.subtitle': 'การแจ้งเตือนที่ยังไม่ปิดเคสและต้องดำเนินการ',
        'alerts.all': 'ทั้งหมด',
        'alerts.conf': 'ความมั่นใจ {n}%',
        'alerts.speed': 'ความเร็ว {speed}/{limit} กม./ชม.',
        'alerts.plate': 'ทะเบียน {plate}',
        'alerts.review': 'ตรวจสอบ',
        'alerts.markRead': 'อ่านแล้ว',
        'alerts.empty': 'ไม่มีการแจ้งเตือนค้างอยู่',

        'inc.title': 'ฐานข้อมูลเหตุการณ์',
        'inc.allStatus': 'ทุกสถานะ',
        'inc.search': 'ค้นหารหัส ทะเบียน สถานที่ กล้อง…',
        'inc.export': 'ส่งออก CSV',
        'inc.empty': 'ไม่พบเหตุการณ์ที่ตรงกับเงื่อนไข',
        'inc.back': '← กลับไปที่รายการ',
        'inc.incident': 'เหตุการณ์',
        'inc.evidence': 'หลักฐาน',
        'inc.details': 'รายละเอียด',
        'inc.speedLimit': 'ความเร็ว / ความเร็วจำกัด',
        'inc.timeline': 'ลำดับสถานะ',
        'inc.notes': 'บันทึกเพิ่มเติม',
        'inc.notePlaceholder': 'เพิ่มบันทึกเกี่ยวกับเหตุการณ์นี้…',
        'inc.addNote': 'เพิ่มบันทึก',
        'inc.noNotes': 'ยังไม่มีบันทึก',

        'tl.detected': 'ระบบตรวจพบ "{type}" ความมั่นใจ {conf}%',
        'tl.reviewed': 'เจ้าหน้าที่ตรวจสอบภาพแล้ว',
        'tl.verified': 'เจ้าหน้าที่ยืนยันว่าเกิดอุบัติเหตุ',
        'tl.actionTaken': 'ดำเนินการกับผู้กระทำผิดแล้ว',
        'tl.responding': 'ส่งหน่วยเข้าช่วยเหลือแล้ว',
        'tl.closed': 'ปิดเคสแล้ว',
        'tl.skipped': 'ข้ามขั้นตอนนี้',
        'tl.falseAlarm': 'ระบุว่าเป็นการแจ้งเตือนผิดพลาด',
        'tl.dismissed': 'ยกเลิกหลังการตรวจสอบ',
        'tl.system': 'ระบบ',

        'act.verify': 'ยืนยันอุบัติเหตุ',
        'act.falseAlarm': 'แจ้งเตือนผิดพลาด',
        'act.dispatch': 'ส่งหน่วยช่วยเหลือ',
        'act.close': 'ปิดเคส',
        'act.review': 'ตรวจสอบแล้ว',
        'act.takeAction': 'ดำเนินการ',
        'act.dismiss': 'ยกเลิก',

        'map.title': 'แผนที่ความเสี่ยงภายในมหาวิทยาลัย',
        'map.desc': 'การกระจายตัวของเหตุการณ์ทั้งหมดที่บันทึกไว้ตามพื้นที่ในมหาวิทยาลัย',
        'map.low': 'ต่ำ (<5)',
        'map.med': 'ปานกลาง (5–10)',
        'map.high': 'สูง (>10)',
        'map.events': 'จำนวนเหตุการณ์',
        'map.risk': 'ความเสี่ยง',
        'map.viewIncidents': 'ดูเหตุการณ์',

        'stats.title': 'สถิติการจราจร',
        'stats.allTime': 'ทั้งหมด',
        'stats.today': 'วันนี้',
        'stats.last7': '7 วันล่าสุด',
        'stats.allTypes': 'ทุกประเภท',
        'stats.allDay': 'ทั้งวัน',
        'stats.morning': 'ช่วงเช้า (06–12)',
        'stats.afternoon': 'ช่วงบ่าย (12–18)',
        'stats.evening': 'ช่วงค่ำ (18–06)',
        'stats.byType': 'การละเมิดแยกตามประเภท',
        'stats.byLoc': 'เหตุการณ์แยกตามสถานที่',
        'stats.byHour': 'เหตุการณ์ตามช่วงเวลา (รายชั่วโมง)',
        'stats.events': 'เหตุการณ์',
        'stats.kpiEvents': 'เหตุการณ์ (ตามตัวกรอง)',
        'stats.kpiAccidents': 'อาจเกิดอุบัติเหตุ',
        'stats.kpiTopLoc': 'สถานที่เกิดเหตุมากที่สุด',
        'stats.kpiBusiest': 'ช่วงเวลาที่เกิดเหตุมากที่สุด',

        'set.title': 'ตั้งค่าระบบ',
        'set.officer': 'ข้อมูลเจ้าหน้าที่',
        'set.name': 'ชื่อ',
        'set.email': 'อีเมล',
        'set.role': 'ตำแหน่ง',
        'set.prefs': 'การใช้งาน',
        'set.language': 'ภาษา',
        'set.sound': 'เสียงแจ้งเตือน',
        'set.soundDesc': 'เล่นเสียงเมื่อตรวจพบเหตุการณ์ใหม่',
        'set.demoMode': 'โหมดสาธิต',
        'set.data': 'จัดการข้อมูล',
        'set.dataDesc': 'การรีเซ็ตจะลบเหตุการณ์ทั้งหมดและโหลดข้อมูลตัวอย่างใหม่',
        'set.reset': 'รีเซ็ตข้อมูลตัวอย่าง',
        'set.adminOnly': 'เฉพาะผู้ดูแลระบบเท่านั้นที่รีเซ็ตข้อมูลได้',
        'set.confirmReset': 'ต้องการรีเซ็ตข้อมูลทั้งหมดใช่หรือไม่?',
        'set.resetDone': 'รีเซ็ตข้อมูลเรียบร้อยแล้ว',
        'set.system': 'ข้อมูลระบบ',
        'set.version': 'เวอร์ชัน',
        'set.versionValue': 'v1.1.0 (ต้นแบบ)',
        'set.storage': 'การจัดเก็บข้อมูล',
        'set.auth': 'การยืนยันตัวตน',
        'set.authValue': 'จำลอง (ตรวจสอบในเบราว์เซอร์)',
        'set.theme': 'ธีม',
        'set.themeValue': 'โทนสว่าง ดูง่าย สบายตา',
        'set.session': 'เซสชัน',
        'set.sessionDesc': 'ออกจากระบบ SDC System',
        'set.logout': 'ออกจากระบบ',
        'set.confirmLogout': 'ต้องการออกจากระบบใช่หรือไม่?',

        'error.loadTitle': 'โหลดหน้าเว็บไม่สำเร็จ',
        'error.loadBody': 'กรุณาเปิดโปรเจกต์ผ่าน local web server (เช่น VS Code Live Server หรือ "npx serve") แทนการเปิดไฟล์ index.html โดยตรง'
    }
};

const I18n = {
    lang: (() => {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved && I18N[saved]) return saved;
        return (navigator.language || '').toLowerCase().startsWith('th') ? 'th' : 'en';
    })()
};

function t(key, params) {
    let text = I18N[I18n.lang][key] ?? I18N.en[key] ?? key;
    if (params) text = text.replace(/\{(\w+)\}/g, (m, p) => (p in params ? params[p] : m));
    return text;
}

const typeLabel = (type) => t(`type.${type}`);
const typeShort = (type) => t(`typeShort.${type}`);
const statusLabel = (status) => t(`status.${status}`);
const locLabel = (loc) => t(`loc.${loc}`);

function getLocale() {
    return I18n.lang === 'th' ? 'th-TH' : 'en-GB';
}

function applyTranslations(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    root.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
    root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    document.querySelectorAll('[data-set-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.setLang === I18n.lang);
        btn.setAttribute('aria-pressed', btn.dataset.setLang === I18n.lang);
    });
}

function setLanguage(lang) {
    if (!I18N[lang] || lang === I18n.lang) return;
    I18n.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    applyTranslations();
    PubSub.emit('language_changed', lang);
}

// Every [data-set-lang] button on any page (topbar, login, settings) switches language
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-set-lang]');
    if (btn) setLanguage(btn.dataset.setLang);
});

document.documentElement.lang = I18n.lang;
applyTranslations();
