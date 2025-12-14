---
title: "Mikrotik Manager"
slug: "mikro-manager"
type: "Team Project"
year: "2024"
description: "A Python-based CLI utility designed to automate common MikroTik RouterOS configuration tasks, featuring a modular architecture and a rich terminal interface."
image: "/images/projects/mikrotik.png"
tech: ["Python", "MikroTik", "Paramiko", "Streamlit", "SSH"]
github: "https://github.com/szuryuu/mikro-manager"
# live: ""
featured: false
order: 7
status: "Completed"
duration: "3 weeks"
team_size: 3
role: "Network and Backend Developer"
---

## The Problem

Network administrators often spend hours manually configuring MikroTik routers via WinBox GUI for repetitive tasks like setting up IP addresses, configuring DHCP servers, or managing backups. This manual process is prone to clicks-errors and lacks the speed required for deploying multiple devices efficiently.

## My Solution

I built **Mikro Manager**, a modular Command Line Interface (CLI) tool that interacts directly with the RouterOS API to automate network provisioning.

-   **Interactive CLI:** Leveraged the `rich` library to create a beautiful, menu-driven terminal interface that is easy to navigate.
-   **Task Automation:** implemented specific modules for critical tasks such as Backup Management, DHCP Setup, NAT Configuration, and IP Address management.
-   **Secure Connection:** Uses environment variables (`.env`) to handle router credentials securely, separating configuration from code.
-   **Modular Design:** Architected with a clear separation of concerns (Views pattern), making it easy to add new configuration modules without breaking the core application.

## Technical Deep Dive

### Architecture Decisions

**Why `routeros_api` wrapper?**
-   **Abstraction:** Instead of writing raw socket commands, I used the `routeros_api` library to interact with MikroTik's resources in a Pythonic way (e.g., `api.get_resource('/ip/address')`). This ensures better error handling and cleaner code.

**Why `Rich` for the UI?**
-   **User Experience:** CLI tools don't have to be ugly. I used `rich.console` and `rich.panel` to display formatted tables, success/error alerts, and banners. This makes the tool approachable for technicians who might not be developers.

### Key Features I Built

#### 1. Modular Resource Interaction
Each network function is encapsulated in its own view. For example, adding an IP address isn't just a script; it's a function that validates input and interacts with the specific RouterOS endpoint.

```bash
# python
# views/ip_address.py
def add_ip(api):
    # ... input prompts ...
    try:
        list_ip = api.get_resource('/ip/address')
        list_ip.add(address=addr, interface=interface)
        console.print(Panel(f"Success: IP {addr} added to {interface}", style="green"))
    except Exception as e:
        console.print(f"[red]Error adding IP: {e}[/red]")
```

#### 2. Centralized Authentication & Menu Loop
The main.py acts as the controller, managing the connection state and routing the user to the correct module based on their input.

```bash
# python
# main.py
def main():
    connection = Connect()
    api = connection.connect()
    
    while True:
        # Display menu with Rich
        console.print(Panel.fit("1. Add IP Address\n2. DHCP Setup\n...", title="Menu"))
        
        match choice:
            case "1":
                ip_address.add_ip(api)
            case "2":
                dhcp.setup_dhcp(api2. Centralized Authentication & Menu Loop
                
                The main.py acts as the controller, managing the connection state and routing the user to the correct module based on their input.)
            # ... handles other modules
```
