import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  BookOpenIcon, 
  PlusIcon, 
  TrashIcon, 
  PencilIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  characterId: string;
  eventId?: string;
  createdAt: Date;
  updatedAt: Date;
  importance: 'low' | 'medium' | 'high';
  category: 'event' | 'person' | 'concept' | 'timeline' | 'analysis';
}

interface InteractiveNotesProps {
  character: any;
  isVisible: boolean;
  onClose: () => void;
}

const InteractiveNotes: React.FC<InteractiveNotesProps> = ({ 
  character, 
  isVisible, 
  onClose 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    importance: 'medium' as 'low' | 'medium' | 'high',
    category: 'event' as 'event' | 'person' | 'concept' | 'timeline' | 'analysis'
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // LocalStorage'dan notları yükle
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${character.id}`);
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, [character.id]);

  // Notları LocalStorage'a kaydet
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`notes_${character.id}`, JSON.stringify(notes));
    }
  }, [notes, character.id]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newNote.content]);

  const addNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      characterId: character.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      importance: newNote.importance,
      category: newNote.category
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({
      title: '',
      content: '',
      tags: '',
      importance: 'medium',
      category: 'event'
    });
    setIsAddingNote(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event': return '📅';
      case 'person': return '👤';
      case 'concept': return '💡';
      case 'timeline': return '⏰';
      case 'analysis': return '🔍';
      default: return '📝';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {character.name} - İnteraktif Notlarım
              </h2>
              <p className="text-gray-600">
                {notes.length} not • {allTags.length} etiket
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕ Kapat
          </Button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Notlarımda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tag Filter */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tüm Etiketler</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            {/* Add Note Button */}
            <Button 
              onClick={() => setIsAddingNote(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Yeni Not
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Note Form */}
          {isAddingNote && (
            <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlusIcon className="w-5 h-5 text-blue-600" />
                  <span>Yeni Not Ekle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    placeholder="Not başlığı..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Input
                    placeholder="Etiketler (virgülle ayırın)..."
                    value={newNote.tags}
                    onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value as any }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="event">📅 Olay</option>
                    <option value="person">👤 Kişi</option>
                    <option value="concept">💡 Kavram</option>
                    <option value="timeline">⏰ Zaman Çizelgesi</option>
                    <option value="analysis">🔍 Analiz</option>
                  </select>
                  
                  <select
                    value={newNote.importance}
                    onChange={(e) => setNewNote(prev => ({ ...prev, importance: e.target.value as any }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Düşük Önem</option>
                    <option value="medium">🟡 Orta Önem</option>
                    <option value="high">🔴 Yüksek Önem</option>
                  </select>
                </div>

                <Textarea
                  ref={textareaRef}
                  placeholder="Not içeriğinizi yazın..."
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[120px] resize-none"
                />

                <div className="flex space-x-3">
                  <Button onClick={addNote} className="bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Not Ekle
                  </Button>
                  <Button 
                    onClick={() => setIsAddingNote(false)} 
                    variant="outline"
                  >
                    İptal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(note.category)}</span>
                        <CardTitle className="text-lg">{note.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{note.createdAt.toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <UserIcon className="w-4 h-4" />
                        <span>{character.name}</span>
                      </div>
                    </div>
                    <Badge className={getImportanceColor(note.importance)}>
                      {note.importance === 'high' ? '🔴 Yüksek' : 
                       note.importance === 'medium' ? '🟡 Orta' : '🟢 Düşük'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {note.content.length > 150 
                        ? `${note.content.substring(0, 150)}...` 
                        : note.content}
                    </p>
                    
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <span className="text-xs mr-1">🏷️</span>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        onClick={() => setEditingNote(note.id)}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => deleteNote(note.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                {searchTerm || selectedTag ? 'Arama kriterlerinize uygun not bulunamadı' : 'Henüz not eklenmemiş'}
              </h3>
              <p className="text-gray-400">
                {searchTerm || selectedTag ? 'Farklı arama terimleri deneyin' : 'İlk notunuzu eklemek için yukarıdaki butona tıklayın'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveNotes;
