# Nook - User Guide

## 🎯 TL;DR (Quick Start)

**Nook** is a minimalist journaling and task management tool with:
- 📝 **Daily Journaling** - Write your thoughts with mood tracking
- ✅ **Smart To-Do List** - Prioritized tasks (1-3 are numbered, rest are bulleted) with drag-and-drop to reorder
- 🗄️ **Archive System** - Keep completed tasks organized and search them anytime
- 📅 **Calendar View** - Navigate past entries easily
- 💾 **Data Export** - Backup everything as JSON

**Getting Started:**
1. Open the app → Start writing in the main area
2. Select your mood (optional)
3. Click "Submit" to save
4. Use the right sidebar for tasks
5. Collapse sidebars for distraction-free writing

---

## 📖 Complete Feature Guide

### 1. Journal Entries

#### Writing Your Entry
- **Main Text Area**: Write freely - no character limits
- **Mood Selection**: Choose from 5 moods (😊 Great, 🙂 Good, 😐 Okay, 😔 Bad, 😢 Terrible)
- **Auto-Save**: Entries are saved when you click "Submit"
- **One Entry Per Day**: Each date can have one journal entry

#### Viewing Past Entries
- **Left Sidebar**: Shows all your entries
- **Calendar Widget**: Click any date to view that day's entry
- **Navigation**: Use ‹ › arrows to browse months
- **Entry Cards**: Display date, mood, and preview text

---

### 2. To-Do List (Right Sidebar)

#### Creating Tasks
- **Empty Slot**: Always available at the bottom
- **Just Type**: Click and start typing
- **Auto-Save**: Tasks save when you click outside or press Enter
- **Enter Key**: Automatically moves to next task

#### Task Priority System
- **First 3 Tasks**: Numbered (1., 2., 3.) - your priorities
- **Other Tasks**: Bulleted (•) - regular tasks
- **Visual Distinction**: Priorities are highlighted

#### Organizing Tasks
- **Drag & Drop**: Reorder tasks by dragging
- **Visual Feedback**: Dashed line shows drop position
- **Smooth Animation**: Tasks slide into place

#### Task States
1. **Active** - Your current tasks
2. **Completed** - Check the box to mark done
3. **Archived** - Long-term storage for completed tasks

#### Task Actions
- **Complete**: Click checkbox ✓
- **Uncomplete**: Click checkbox again (in Completed section)
- **Archive**: Hover over completed task → Click 🗄️
- **Delete**: Hover over completed task → Click 🗑️
- **Unarchive**: In archived view → Click "Unarchive"

---

### 3. Archive System

#### Accessing Archives
- **View Archived Button**: Appears when you have archived tasks
- **Count Badge**: Shows number of archived tasks (orange)
- **Separate View**: Clean, dedicated page for archives

#### Archive Features
- **Search Bar**: Filter archived tasks by text
- **Unarchive**: Restore tasks to completed section
- **Delete Individual**: Remove specific archived tasks
- **Delete All**: Clear all archived tasks (with confirmation)
- **Back Button**: Return to main to-do view

---

### 4. Sidebar Management

#### Left Sidebar (Entries)
- **Collapse**: Click ‹ chevron to hide
- **Expand**: Click 📝 button when collapsed
- **Persistent State**: Remembers your preference

#### Right Sidebar (To-Do)
- **Collapse**: Click › chevron to hide
- **Expand**: Click ✓ button when collapsed
- **Persistent State**: Remembers your preference

#### Distraction-Free Mode
- Collapse both sidebars for maximum focus
- Full-width writing area
- Quick access buttons remain visible

---

### 5. Data Management

#### Export Your Data
**Location**: Settings (⚙️ icon)

**What's Exported:**
- All journal entries (with dates, moods, content)
- Active to-dos
- Completed to-dos
- Archived to-dos
- Export timestamp

**File Format**: JSON (easy to read and parse)

**File Name**: `nook-export-YYYY-MM-DD.json`

**Use Cases:**
- Regular backups
- Migrate to another device
- Data analysis
- Import to other tools

---

### 6. Keyboard & Interaction Tips

#### Efficient Workflows
- **Tab**: Navigate between fields
- **Enter**: Save task and move to next
- **Escape**: Close settings/modals
- **Click Outside**: Auto-save tasks

#### Best Practices
1. **Daily Routine**: Write at the same time each day
2. **Mood Tracking**: Be honest - patterns emerge over time
3. **Priority Tasks**: Keep top 3 focused on what matters most
4. **Regular Archives**: Archive completed tasks weekly
5. **Export Monthly**: Backup your data regularly

---

### 7. Visual Design

#### Color System
- **Peach Orange**: Priority tasks, accents, highlights
- **Sage Green**: Subtle accents (previously used)
- **Neutral Tones**: Background, text, borders
- **Mood Colors**: Visual indicators for entries

#### Layout
- **Minimalist**: Clean, distraction-free interface
- **Responsive**: Adapts to your screen size
- **Smooth Animations**: Polished interactions
- **Dark Mode Ready**: Easy on the eyes

---

### 8. Data Storage

#### Local Storage
- All data stored in your browser
- No server required
- Private and secure
- Offline-capable

#### Data Structure
```json
{
  "exportDate": "2025-11-25T...",
  "journalEntries": [...],
  "todos": {
    "active": [...],
    "completed": [...],
    "archived": [...]
  }
}
```

---

### 9. Troubleshooting

#### Common Issues

**Tasks not saving?**
- Click outside the task or press Enter
- Check browser console for errors

**Sidebar buttons not working?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache

**Lost data?**
- Check if you're on the same browser/device
- Data is stored per browser
- Export regularly to prevent loss

**Drag and drop not working?**
- Ensure task has text (empty tasks can't be dragged)
- Try refreshing the page

---

### 10. Future Enhancements (Potential)

Ideas for future development:
- Markdown support for journal entries
- Search functionality for entries
- Tags/categories for entries
- Import data functionality
- Cloud sync (requires backend)
- Mobile app version
- Themes/customization
- Statistics and insights

---

## 💡 Pro Tips

1. **Consistent Journaling**: Even 2-3 sentences daily builds the habit
2. **Honest Mood Tracking**: Patterns help identify triggers
3. **Priority Discipline**: Only 3 priorities - forces focus
4. **Weekly Review**: Check archived tasks to see progress
5. **Monthly Export**: Backup your data regularly
6. **Distraction-Free**: Collapse sidebars when writing
7. **Task Batching**: Group similar tasks together
8. **Archive Liberally**: Keep active list clean and focused

---

## 🎨 Design Philosophy

**Minimalism**: No clutter, just what you need
**Privacy**: Your data stays on your device
**Speed**: Instant load, no waiting
**Simplicity**: Intuitive, no learning curve
**Focus**: Designed for deep work and reflection

---

## 📱 Browser Compatibility

**Fully Supported:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Requirements:**
- JavaScript enabled
- LocalStorage enabled
- Modern browser (ES6+ support)

---

## 🔒 Privacy & Security

- **No Tracking**: Zero analytics or tracking
- **No Account**: No login required
- **Local Only**: Data never leaves your device
- **No Ads**: Clean, ad-free experience
- **Open Source**: Code is transparent

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Try hard refresh (Cmd+Shift+R)
3. Clear browser cache
4. Export data before troubleshooting

---

**Version**: 1.0  
**Last Updated**: November 25, 2025  
**License**: Personal Use

---

Enjoy your journaling and task management! 🎉
