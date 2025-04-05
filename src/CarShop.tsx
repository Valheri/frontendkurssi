import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import "./CarShop.css";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type Car = {
    id?: number;
    brand: string;
    model: string;
    color: string;
    fuel: string;
    modelYear: number;
    price: number;
    _links?: {
        self: {
            href: string;
        };
    };
};

function CarShop() {
    const [cars, setCars] = useState<Car[]>([]);
    const [open, setOpen] = useState(false);
    const [currentCar, setCurrentCar] = useState<Car | null>(null);
    const gridRef = useRef<AgGridReact<Car>>(null);

    const fetchCars = () => {
        fetch("https://car-rest-service-carshop.2.rahtiapp.fi/cars")
            .then((response) => response.json())
            .then((data) => {
                // Map the cars and extract IDs from the self links
                const carsWithIds = data._embedded.cars.map((car: Car) => {
                    // Extract ID from the self link URL
                    const selfLink = car._links?.self.href;
                    const id = selfLink ? parseInt(selfLink.split("/").pop() || "0") : undefined;
                    return { ...car, id };
                });
                setCars(carsWithIds);
            })
            .catch(error => console.error("Error fetching cars:", error));
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleSave = () => {
        if (currentCar) {
            const method = currentCar.id ? "PUT" : "POST";
            const url = currentCar.id
                ? `https://car-rest-service-carshop.2.rahtiapp.fi/cars/${currentCar.id}`
                : "https://car-rest-service-carshop.2.rahtiapp.fi/cars";

            fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    brand: currentCar.brand,
                    model: currentCar.model,
                    color: currentCar.color,
                    fuel: currentCar.fuel,
                    modelYear: currentCar.modelYear,
                    price: currentCar.price,
                }),
            })
                .then(() => {
                    setOpen(false);
                    setCurrentCar(null);
                    fetchCars();
                })
                .catch(error => console.error("Error saving car:", error));
        }
    };

    const handleDelete = () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            const selectedCar = selectedNodes[0].data;
            if (selectedCar && selectedCar.id) {
                fetch(`https://car-rest-service-carshop.2.rahtiapp.fi/cars/${selectedCar.id}`, {
                    method: "DELETE",
                })
                    .then(() => {
                        fetchCars();
                    })
                    .catch((error) => console.error("Error deleting car:", error));
            } else {
                alert("Selected car has no ID");
            }
        } else {
            alert("Please select a car to delete");
        }
    };

    const handleEdit = () => {
        const selectedNodes = gridRef.current?.api.getSelectedNodes();
        if (selectedNodes && selectedNodes.length > 0) {
            setCurrentCar(selectedNodes[0].data);
            setOpen(true);
        } else {
            alert("Please select a car to edit");
        }
    };

    // Column definitions for AG Grid
    const [columnDefs] = useState<ColDef<Car>[]>([
        { field: "brand", headerName: "Brand", filter: true, sortable: true },
        { field: "model", headerName: "Model", filter: true, sortable: true },
        { field: "color", headerName: "Color", filter: true, sortable: true },
        { field: "fuel", headerName: "Fuel", filter: true, sortable: true },
        {
            field: "modelYear",
            headerName: "Year",
            filter: 'agNumberColumnFilter',
            sortable: true,
            width: 100
        },
        {
            field: "price",
            headerName: "Price",
            filter: 'agNumberColumnFilter',
            sortable: true,
            valueFormatter: (params) => {
                return params.value ? `$${params.value.toFixed(2)}` : '';
            }
        }
    ]);

    return (
        <div className="car-shop-container">
            <Typography variant="h4" gutterBottom>
                Car Shop
            </Typography>
            <div className="car-buttons">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setCurrentCar({
                            brand: "",
                            model: "",
                            color: "",
                            fuel: "",
                            modelYear: new Date().getFullYear(),
                            price: 0,
                        });
                        setOpen(true);
                    }}
                >
                    Add Car
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEdit}
                >
                    Edit
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </div>

            <div className="ag-theme-material" style={{ height: 500, width: '100%', marginTop: 20 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={cars}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={10}
                    domLayout="autoHeight"
                />
            </div>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>{currentCar?.id ? "Edit Car" : "Add Car"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Brand"
                        fullWidth
                        margin="normal"
                        value={currentCar?.brand || ""}
                        onChange={(e) =>
                            setCurrentCar({ ...currentCar!, brand: e.target.value })
                        }
                    />
                    <TextField
                        label="Model"
                        fullWidth
                        margin="normal"
                        value={currentCar?.model || ""}
                        onChange={(e) =>
                            setCurrentCar({ ...currentCar!, model: e.target.value })
                        }
                    />
                    <TextField
                        label="Color"
                        fullWidth
                        margin="normal"
                        value={currentCar?.color || ""}
                        onChange={(e) =>
                            setCurrentCar({ ...currentCar!, color: e.target.value })
                        }
                    />
                    <TextField
                        label="Fuel"
                        fullWidth
                        margin="normal"
                        value={currentCar?.fuel || ""}
                        onChange={(e) =>
                            setCurrentCar({ ...currentCar!, fuel: e.target.value })
                        }
                    />
                    <TextField
                        label="Year"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={currentCar?.modelYear || ""}
                        onChange={(e) =>
                            setCurrentCar({
                                ...currentCar!,
                                modelYear: parseInt(e.target.value, 10),
                            })
                        }
                    />
                    <TextField
                        label="Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={currentCar?.price || ""}
                        onChange={(e) =>
                            setCurrentCar({
                                ...currentCar!,
                                price: parseFloat(e.target.value),
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CarShop;
