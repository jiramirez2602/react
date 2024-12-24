import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus } from 'lucide-react'

const apiUrl = 'http://localhost:3000/modeloAviones';

interface AirplaneModel {
  moa_codigo: number;
  moa_nombre: string;
  moa_descripcion: string;
  moa_longitud: number;
  moa_envergadura: number;
  moa_altura: number;
  moa_peso_vacio: number;
}

export default function AirplaneModels() {
  const [models, setModels] = useState<AirplaneModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState('10');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<AirplaneModel | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}?limit=${limit}&search=${searchTerm}`);
      const data = await response.json();
      if (data.status === 'success') {
        setModels(data.data);
      } else {
        console.error('Error al obtener datos:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newModel = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModel),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Modelo de avión creado exitosamente');
        setIsCreateModalOpen(false);
        fetchData();
      } else {
        alert('Error al crear el modelo de avión: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el modelo de avión');
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const updatedModel = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedModel),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Modelo de avión actualizado exitosamente');
        setIsUpdateModalOpen(false);
        fetchData();
      } else {
        alert('Error al actualizar el modelo de avión: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el modelo de avión');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este modelo de avión?')) {
      try {
        const response = await fetch(`${apiUrl}?id=${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.status === 'success') {
          alert('Modelo de avión eliminado exitosamente');
          fetchData();
        } else {
          alert('Error al eliminar el modelo de avión: ' + data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el modelo de avión');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modelos de Aviones</h1>
      
      <div className="flex gap-4 mb-4">
        <Input
          type="text"
          placeholder="Buscar modelos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={limit} onValueChange={setLimit}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Elementos por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="25">25 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchData}>Buscar</Button>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Crear Modelo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Modelo de Avión</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" required />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input id="descripcion" name="descripcion" required />
              </div>
              <div>
                <Label htmlFor="longitud">Longitud (m)</Label>
                <Input type="number" id="longitud" name="longitud" step="0.1" required />
              </div>
              <div>
                <Label htmlFor="envergadura">Envergadura (m)</Label>
                <Input type="number" id="envergadura" name="envergadura" step="0.1" required />
              </div>
              <div>
                <Label htmlFor="altura">Altura (m)</Label>
                <Input type="number" id="altura" name="altura" step="0.1" required />
              </div>
              <div>
                <Label htmlFor="peso_vacio">Peso Vacío (kg)</Label>
                <Input type="number" id="peso_vacio" name="peso_vacio" required />
              </div>
              <Button type="submit">Crear Modelo</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Longitud (m)</TableHead>
            <TableHead>Envergadura (m)</TableHead>
            <TableHead>Altura (m)</TableHead>
            <TableHead>Peso Vacío (kg)</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.moa_codigo}>
              <TableCell>{model.moa_codigo}</TableCell>
              <TableCell>{model.moa_nombre}</TableCell>
              <TableCell>{model.moa_descripcion}</TableCell>
              <TableCell>{model.moa_longitud}</TableCell>
              <TableCell>{model.moa_envergadura}</TableCell>
              <TableCell>{model.moa_altura}</TableCell>
              <TableCell>{model.moa_peso_vacio}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentModel(model)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Actualizar Modelo de Avión</DialogTitle>
                      </DialogHeader>
                      {currentModel && (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <Input type="hidden" name="codigo" value={currentModel.moa_codigo} />
                          <div>
                            <Label htmlFor="updateNombre">Nombre</Label>
                            <Input id="updateNombre" name="nombre" defaultValue={currentModel.moa_nombre} required />
                          </div>
                          <div>
                            <Label htmlFor="updateDescripcion">Descripción</Label>
                            <Input id="updateDescripcion" name="descripcion" defaultValue={currentModel.moa_descripcion} required />
                          </div>
                          <div>
                            <Label htmlFor="updateLongitud">Longitud (m)</Label>
                            <Input type="number" id="updateLongitud" name="longitud" step="0.1" defaultValue={currentModel.moa_longitud} required />
                          </div>
                          <div>
                            <Label htmlFor="updateEnvergadura">Envergadura (m)</Label>
                            <Input type="number" id="updateEnvergadura" name="envergadura" step="0.1" defaultValue={currentModel.moa_envergadura} required />
                          </div>
                          <div>
                            <Label htmlFor="updateAltura">Altura (m)</Label>
                            <Input type="number" id="updateAltura" name="altura" step="0.1" defaultValue={currentModel.moa_altura} required />
                          </div>
                          <div>
                            <Label htmlFor="updatePesoVacio">Peso Vacío (kg)</Label>
                            <Input type="number" id="updatePesoVacio" name="peso_vacio" defaultValue={currentModel.moa_peso_vacio} required />
                          </div>
                          <Button type="submit">Actualizar Modelo</Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(model.moa_codigo)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

