// import React from 'react';
// import { Home, Settings, Book, UserCheck } from 'lucide-react';

// const Sidebar = ({ onNavigation }) => {
//   return (
//     <div className="bg-white/90 backdrop-blur-sm rounded-r-lg shadow-xl border-r border-indigo-100 p-4 w-45 h-screen">
//       <div className="space-y-6 h-full flex flex-col justify-between">
//         <div>
//           <div className="text-center mb-6">
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//               Menu
//             </h2>
//           </div>
//           <div className="space-y-4">
//             <button
//               className="flex items-center space-x-3 w-full px-4 py-2 rounded-md hover:bg-indigo-100 transition"
//               onClick={() => onNavigation('/myboards')}
//             >
//               <Home className="w-6 h-6 text-indigo-600" />
//               <span className="text-gray-700 font-medium">My Boards</span>
//             </button>
//             <button
//               className="flex items-center space-x-3 w-full px-4 py-2 rounded-md hover:bg-indigo-100 transition"
//               onClick={() => onNavigation('/parental-control')}
//             >
//               <Settings className="w-6 h-6 text-indigo-600" />
//               <span className="text-gray-700 font-medium">Parental Control</span>
//             </button>
//             <button
//               className="flex items-center space-x-3 w-full px-4 py-2 rounded-md hover:bg-indigo-100 transition"
//               onClick={() => onNavigation('/storytelling')}
//             >
//               <Book className="w-6 h-6 text-indigo-600" />
//               <span className="text-gray-700 font-medium">Storytelling</span>
//             </button>
//             <button
//               className="flex items-center space-x-3 w-full px-4 py-2 rounded-md hover:bg-indigo-100 transition"
//               onClick={() => onNavigation('/roleplaying')}
//             >
//               <UserCheck className="w-6 h-6 text-indigo-600" />
//               <span className="text-gray-700 font-medium">Role Playing</span>
//             </button>
//           </div>
//         </div>
      
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { FaHamburger } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {['My Boards', 'ParentalControl', 'StoryTelling', 'RolePlaying'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}><MenuIcon/></Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}